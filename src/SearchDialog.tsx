import { useEffect, useMemo, useRef, useState, memo, useCallback } from "react";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import { Lecture } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import axios from "axios";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";
import SearchControls from "./components/SearchFilters/SearchControls.tsx";
import SearchTableHeader from "./components/SearchResult/SearchTableHeader.tsx";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

export interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

const PAGE_SIZE = 100;

// API 호출 최적화 - 캐싱 추가
let lecturesCache: Lecture[] | null = null;
let loadingPromise: Promise<Lecture[]> | null = null;

// 컴포넌트 외부에서 사용할 캐시 맵
const cachedApi = new Map<string, ApiResponse<Lecture[]>>();

const cachedFetch = (
  fetchFn: () => Promise<ApiResponse<Lecture[]>>
): Promise<ApiResponse<Lecture[]>> => {
  const key = fetchFn.name;
  if (cachedApi.has(key)) {
    const cached = cachedApi.get(key);
    if (cached) return Promise.resolve(cached);
  }

  const promise = fetchFn().then((res) => {
    cachedApi.set(key, res);
    return res;
  });

  return promise;
};

const base =
  process.env.NODE_ENV === "production" ? "/front_6th_chapter4-2/" : "/";

const fetchMajors = () => axios.get<Lecture[]>(`${base}schedules-majors.json`);
const fetchLiberalArts = () =>
  axios.get<Lecture[]>(`${base}schedules-liberal-arts.json`);

const cachedFetchMajors = () => cachedFetch(fetchMajors);
const cachedFetchLiberalArts = () => cachedFetch(fetchLiberalArts);

const fetchAllLectures = async (): Promise<Lecture[]> => {
  // 이미 캐시된 데이터가 있으면 반환
  if (lecturesCache) {
    return lecturesCache;
  }

  // 이미 로딩 중이면 기존 Promise 반환
  if (loadingPromise) {
    return loadingPromise;
  }

  // 새로운 로딩 시작
  loadingPromise = (async () => {
    const start = performance.now();
    console.log("API 호출 시작: ", start);

    try {
      const [majorsResult, liberalArtsResult] = await Promise.all([
        (console.log("API Call 1", performance.now()), cachedFetchMajors()),
        (console.log("API Call 2", performance.now()),
        cachedFetchLiberalArts()),
        (console.log("API Call 3", performance.now()), cachedFetchMajors()),
        (console.log("API Call 4", performance.now()),
        cachedFetchLiberalArts()),
        (console.log("API Call 5", performance.now()), cachedFetchMajors()),
        (console.log("API Call 6", performance.now()),
        cachedFetchLiberalArts()),
      ]);

      const allLectures = [...majorsResult.data, ...liberalArtsResult.data];

      const end = performance.now();
      console.log("모든 API 호출 완료 ", end);
      console.log("API 호출에 걸린 시간(ms): ", end - start);

      // 캐시에 저장
      lecturesCache = allLectures;
      return allLectures;
    } finally {
      // 로딩 완료 후 Promise 초기화
      loadingPromise = null;
    }
  })();

  return loadingPromise;
};

// 강의 데이터를 미리 파싱하여 캐시
const createLectureCache = (lectures: Lecture[]) => {
  return lectures.map((lecture) => ({
    ...lecture,
    parsedSchedules: lecture.schedule
      ? parseSchedule(lecture.schedule).map((schedule) => ({
          ...schedule,
          lecture: {
            id: lecture.id,
            title: lecture.title,
            grade: lecture.grade,
            credits: lecture.credits,
            major: lecture.major,
            schedule: lecture.schedule,
          },
        }))
      : [],
    titleLower: lecture.title.toLowerCase(),
    idLower: lecture.id.toLowerCase(),
  }));
};

type CachedLecture = {
  id: string;
  title: string;
  credits: string;
  major: string;
  schedule: string;
  grade: number;
  parsedSchedules: Array<{
    day: string;
    range: number[];
    room?: string;
    lecture: {
      id: string;
      title: string;
      grade: number;
      credits: string;
      major: string;
      schedule: string;
    };
  }>;
  titleLower: string;
  idLower: string;
};

// 필터링 로직을 별도 함수로 분리하여 최적화
const filterLectures = (
  lectures: CachedLecture[],
  searchOptions: SearchOption
): CachedLecture[] => {
  const { query = "", credits, grades, days, times, majors } = searchOptions;
  const queryLower = query.toLowerCase();

  const filtered = lectures.filter((lecture) => {
    // 검색어 필터 (미리 소문자로 변환된 값 사용)
    if (
      query &&
      !lecture.titleLower.includes(queryLower) &&
      !lecture.idLower.includes(queryLower)
    ) {
      return false;
    }

    // 학년 필터
    if (grades.length > 0 && !grades.includes(lecture.grade)) {
      return false;
    }

    // 전공 필터
    if (majors.length > 0 && !majors.includes(lecture.major)) {
      return false;
    }

    // 학점 필터
    if (credits && !lecture.credits.startsWith(String(credits))) {
      return false;
    }

    // 요일/시간 필터 (미리 파싱된 스케줄 사용)
    if (days.length > 0 || times.length > 0) {
      const schedules = lecture.parsedSchedules;

      if (
        days.length > 0 &&
        !schedules.some((s: any) => days.includes(s.day))
      ) {
        return false;
      }

      if (
        times.length > 0 &&
        !schedules.some((s: any) =>
          s.range.some((time: any) => times.includes(time))
        )
      ) {
        return false;
      }
    }

    return true;
  });
  return filtered;
};

const SearchDialog = memo(({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<CachedLecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  // 강의 데이터를 캐시된 형태로 변환
  const cachedLectures = useMemo(() => {
    if (lectures.length === 0) return [];
    return lectures;
  }, [lectures]);

  // 필터링된 강의 목록을 메모이제이션
  const filteredLectures = useMemo(() => {
    return filterLectures(cachedLectures, searchOptions);
  }, [cachedLectures, searchOptions]);

  // 페이지네이션 계산을 메모이제이션
  const paginationInfo = useMemo(() => {
    const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
    const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);
    return { lastPage, visibleLectures };
  }, [filteredLectures, page]);

  // 전공 목록을 메모이제이션
  const allMajors = useMemo(() => {
    return [...new Set(cachedLectures.map((lecture) => lecture.major))];
  }, [cachedLectures]);

  // 검색 옵션 변경 핸들러 메모이제이션
  const changeSearchOption = useAutoCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    }
  );

  // 각 필터별 개별 핸들러 함수들
  const handleGradeChange = useCallback(
    (value: number[]) => {
      changeSearchOption("grades", value);
    },
    [changeSearchOption]
  );

  const handleDayChange = useCallback(
    (value: string[]) => {
      changeSearchOption("days", value);
    },
    [changeSearchOption]
  );

  const handleTimeChange = useCallback(
    (values: number[]) => {
      changeSearchOption("times", values);
    },
    [changeSearchOption]
  );

  const handleMajorChange = useCallback(
    (values: string[]) => {
      changeSearchOption("majors", values);
    },
    [changeSearchOption]
  );

  const handleQueryChange = useCallback(
    (value: string) => {
      changeSearchOption("query", value);
    },
    [changeSearchOption]
  );

  const handleCreditsChange = useCallback(
    (value: string | number) => {
      const creditsValue =
        typeof value === "string" ? parseInt(value) || undefined : value;
      changeSearchOption("credits", creditsValue);
    },
    [changeSearchOption]
  );

  const addSchedule = useAutoCallback((lecture: CachedLecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;
    const schedules = lecture.parsedSchedules.map((schedule: any) => ({
      ...schedule,
      lecture: {
        id: lecture.id,
        title: lecture.title,
        grade: lecture.grade,
        credits: lecture.credits,
        major: lecture.major,
        schedule: lecture.schedule,
      },
    }));

    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));

    onClose();
  });

  // API 호출 최적화
  useEffect(() => {
    fetchAllLectures().then((rawLectures) => {
      const cached = createLectureCache(rawLectures);
      setLectures(cached);
    });
  }, []);

  // Intersection Observer 최적화
  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) =>
            Math.min(paginationInfo.lastPage, prevPage + 1)
          );
        }
      },
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => {
      observer.unobserve($loader);
      observer.disconnect(); // 메모리 누수 방지
    };
  }, [paginationInfo.lastPage]);

  // searchInfo 변경 시 검색 옵션 업데이트
  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    setPage(1);
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <SearchControls.SearchInput
                value={searchOptions.query || ""}
                onChange={handleQueryChange}
              />
              <SearchControls.CreditsSelect
                value={searchOptions.credits || ""}
                onChange={handleCreditsChange}
              />
            </HStack>

            <HStack spacing={4}>
              <SearchControls.GradeFilter
                value={searchOptions.grades}
                onChange={handleGradeChange}
              />
              <SearchControls.DayFilter
                value={searchOptions.days}
                onChange={handleDayChange}
              />
            </HStack>

            <HStack spacing={4}>
              <SearchControls.TimeFilter
                value={searchOptions.times}
                onChange={handleTimeChange}
              />
              <SearchControls.MajorFilter
                value={searchOptions.majors}
                onChange={handleMajorChange}
                allMajors={allMajors}
              />
            </HStack>

            <Text align="right">검색결과: {filteredLectures.length}개</Text>
            <Box>
              <SearchTableHeader />

              <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
                <Table size="sm" variant="striped">
                  <Tbody>
                    {paginationInfo.visibleLectures.map((lecture, index) => (
                      <Tr key={`${lecture.id}-${index}`}>
                        <Td width="100px">{lecture.id}</Td>
                        <Td width="50px">{lecture.grade}</Td>
                        <Td width="200px">{lecture.title}</Td>
                        <Td width="50px">{lecture.credits}</Td>
                        <Td
                          width="150px"
                          dangerouslySetInnerHTML={{ __html: lecture.major }}
                        />
                        <Td
                          width="150px"
                          dangerouslySetInnerHTML={{ __html: lecture.schedule }}
                        />
                        <Td width="80px">
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => addSchedule(lecture)}
                          >
                            추가
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Box ref={loaderRef} h="20px" />
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

SearchDialog.displayName = "SearchDialog";

export default SearchDialog;
