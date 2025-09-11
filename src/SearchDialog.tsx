import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  SearchInputFilter,
  GradeFilter,
  DayFilter,
  TimeFilter,
  MajorFilter,
  LectureTable,
  TableHeader,
} from "./components/SearchDialog";
import { useScheduleContext } from "./ScheduleContext.tsx";
import type { Lecture } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

const PAGE_SIZE = 100;

// API 캐시를 위한 간단한 캐시 구현
const createApiCache = () => {
  const cache = new Map<string, Promise<{ data: Lecture[] }>>();

  return (key: string, fetcher: () => Promise<{ data: Lecture[] }>) => {
    if (cache.has(key)) {
      console.log(`캐시에서 반환: ${key}`);
      return cache.get(key) as Promise<{ data: Lecture[] }>;
    }

    console.log(`API 호출: ${key}`);
    const promise = fetcher();
    cache.set(key, promise);
    return promise;
  };
};

const apiCache = createApiCache();

const fetchMajors = () => apiCache("fetchMajors", () => axios.get<Lecture[]>("/schedules-majors.json"));
const fetchLiberalArts = () => apiCache("fetchLiberalArts", () => axios.get<Lecture[]>("/schedules-liberal-arts.json"));

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const fetchAllLectures = async () => {
  const start = performance.now();
  console.log("API 호출 시작: ", start);

  // apiCache를 사용하여 중복 호출을 방지하면서도 원래 구조 유지
  const results = await Promise.all([
    fetchMajors(), // 캐시됨
    fetchLiberalArts(), // 캐시됨
    fetchMajors(), // 캐시에서 반환
    fetchLiberalArts(), // 캐시에서 반환
    fetchMajors(), // 캐시에서 반환
    fetchLiberalArts(), // 캐시에서 반환
  ]);

  const end = performance.now();
  console.log("API 호출 완료: ", end);
  console.log("API 호출에 걸린 시간(ms): ", end - start);

  return results;
};

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = memo(({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const { filteredLectures, allMajors } = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;
    const filteredLectures = lectures
      .filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase())
      )
      .filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
      .filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
      .filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
      .filter((lecture) => {
        if (days.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some((s) => days.includes(s.day));
      })
      .filter((lecture) => {
        if (times.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some((s) => s.range.some((time) => times.includes(time)));
      });

    const allMajors = [...new Set(lectures.map((lecture) => lecture.major))];

    return {
      filteredLectures,
      allMajors,
    };
  }, [lectures, searchOptions]);

  const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);

  const changeSearchOption = useAutoCallback((field: keyof SearchOption, value: SearchOption[typeof field]) => {
    setPage(1);
    setSearchOptions((prev) => ({ ...prev, [field]: value }));
    loaderWrapperRef.current?.scrollTo(0, 0);
  });

  const addSchedule = useMemo(
    () => (lecture: Lecture) => {
      if (!searchInfo) return;

      const { tableId } = searchInfo;

      const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
        ...schedule,
        lecture,
      }));

      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: [...prev[tableId], ...schedules],
      }));

      onClose();
    },
    [searchInfo, setSchedulesMap, onClose]
  );

  useEffect(() => {
    fetchAllLectures().then((results) => {
      setLectures(results.flatMap((result) => result.data));
    });
  }, []);

  useEffect(() => {
    // 모달이 닫혀있으면 Observer 등록하지 않음
    if (!searchInfo) return;
    if (lectures.length === 0) return;

    let timeoutId: NodeJS.Timeout | null = null;
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      const $loader = loaderRef.current;
      const $loaderWrapper = loaderWrapperRef.current;

      if (!$loader || !$loaderWrapper) {
        timeoutId = setTimeout(setupObserver, 100);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => {
              const currentLastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
              return Math.min(currentLastPage, prevPage + 1);
            });
          }
        },
        { threshold: 0, root: $loaderWrapper }
      );

      observer.observe($loader);
    };

    setupObserver();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [searchInfo, lectures.length, filteredLectures.length]);

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
            <SearchInputFilter
              query={searchOptions.query}
              credits={searchOptions.credits}
              onChange={changeSearchOption}
            />

            <HStack spacing={4}>
              <GradeFilter grades={searchOptions.grades} onChange={(grades) => changeSearchOption("grades", grades)} />
              <DayFilter days={searchOptions.days} onChange={(days) => changeSearchOption("days", days)} />
            </HStack>

            <HStack spacing={4}>
              <TimeFilter times={searchOptions.times} onChange={changeSearchOption} />
              <MajorFilter majors={searchOptions.majors} allMajors={allMajors} onChange={changeSearchOption} />
            </HStack>

            <Text align="right">검색결과: {filteredLectures.length}개</Text>
            <Box>
              <TableHeader />
              <Box ref={loaderWrapperRef} overflowY="auto" maxH="500px">
                <LectureTable visibleLectures={visibleLectures} onAddSchedule={addSchedule} />
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
