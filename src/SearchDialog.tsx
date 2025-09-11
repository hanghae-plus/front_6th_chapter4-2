import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import { Lecture } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import axios from "axios";
import { ApiCache } from "./api/apiCache.ts";
import { LectureItem } from "./searchDialog/LectureItem.tsx";
import SearchInput from "./searchDialog/SearchInput.tsx";
import SelectCredit from "./searchDialog/SelectCredit.tsx";
import SelectGrade from "./searchDialog/SelectGrade.tsx";
import SelectDay from "./searchDialog/SelectDay.tsx";
import SelectTime from "./searchDialog/SelectTime.tsx";
import SelectMajor from "./searchDialog/SelectMajor.tsx";

interface Props {
  isOpen: boolean;
  tableId: string | null;
  initialDay?: string;
  initialTime?: number;
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

const apiCache = new ApiCache();

const fetchMajors = () =>
  apiCache.get(
    "majors",
    () => axios.get<Lecture[]>("/schedules-majors.json"),
    10 * 60 * 1000
  );

const fetchLiberalArts = () =>
  apiCache.get(
    "liberalArts",
    () => axios.get<Lecture[]>("/schedules-liberal-arts.json"),
    5 * 60 * 1000
  );
// API 호출을 최적화: 각 API를 한 번씩만 병렬로 호출
const fetchAllLectures = async () =>
  await Promise.all([
    (console.log("API Call 1", performance.now()), fetchMajors()),
    (console.log("API Call 2", performance.now()), fetchLiberalArts()),
    (console.log("API Call 3", performance.now()), fetchMajors()),
    (console.log("API Call 4", performance.now()), fetchLiberalArts()),
    (console.log("API Call 5", performance.now()), fetchMajors()),
    (console.log("API Call 6", performance.now()), fetchLiberalArts()),
  ]);

// 성능 최적화 완료:
// 1. API 호출 중복 제거 및 캐싱 적용
// 2. 필터링 로직 최적화 (parseSchedule 캐싱, 조건 순서 최적화)
// 3. useCallback/useMemo를 통한 불필요한 리렌더링 방지
// 4. 컴포넌트 분리 (LectureItem)를 통한 렌더링 최적화
// 5. 개별 이벤트 핸들러 최적화
const SearchDialog = ({
  isOpen,
  tableId,
  initialDay,
  initialTime,
  onClose,
}: Props) => {
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

  // 강의 데이터에 파싱된 스케줄 정보를 캐시하여 성능 최적화
  const lecturesWithParsedSchedules = useMemo(() => {
    return lectures.map((lecture) => ({
      ...lecture,
      parsedSchedules: lecture.schedule ? parseSchedule(lecture.schedule) : [],
    }));
  }, [lectures]);

  const getFilteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;
    const queryLower = query.toLowerCase();

    return lecturesWithParsedSchedules.filter((lecture) => {
      // 빠른 필터링을 위해 가장 제한적인 조건부터 확인
      if (
        query &&
        !(
          lecture.title.toLowerCase().includes(queryLower) ||
          lecture.id.toLowerCase().includes(queryLower)
        )
      ) {
        return false;
      }

      if (grades.length > 0 && !grades.includes(lecture.grade)) {
        return false;
      }

      if (majors.length > 0 && !majors.includes(lecture.major)) {
        return false;
      }

      if (credits && !lecture.credits.startsWith(String(credits))) {
        return false;
      }

      if (days.length > 0) {
        if (!lecture.parsedSchedules.some((s) => days.includes(s.day))) {
          return false;
        }
      }

      if (times.length > 0) {
        if (
          !lecture.parsedSchedules.some((s) =>
            s.range.some((time) => times.includes(time))
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [lecturesWithParsedSchedules, searchOptions]);

  const filteredLectures = useMemo(
    () => getFilteredLectures,
    [getFilteredLectures]
  );
  const lastPage = useMemo(
    () => Math.ceil(filteredLectures.length / PAGE_SIZE),
    [filteredLectures]
  );
  const visibleLectures = useMemo(
    () => filteredLectures.slice(0, page * PAGE_SIZE),
    [filteredLectures, page]
  );
  const allMajors = useMemo(
    () => [...new Set(lectures.map((lecture) => lecture.major))],
    [lectures]
  );

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    },
    []
  );

  // 개별 핸들러들을 useCallback으로 최적화
  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      changeSearchOption("query", e.target.value);
    },
    [changeSearchOption]
  );

  const handleCreditsChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      changeSearchOption("credits", e.target.value);
    },
    [changeSearchOption]
  );

  const handleGradesChange = useCallback(
    (value: (string | number)[]) => {
      changeSearchOption("grades", value.map(Number));
    },
    [changeSearchOption]
  );

  const handleDaysChange = useCallback(
    (value: (string | number)[]) => {
      changeSearchOption("days", value as string[]);
    },
    [changeSearchOption]
  );

  const handleTimesChange = useCallback(
    (values: (string | number)[]) => {
      changeSearchOption("times", values.map(Number));
    },
    [changeSearchOption]
  );

  const handleMajorsChange = useCallback(
    (values: (string | number)[]) => {
      changeSearchOption("majors", values as string[]);
    },
    [changeSearchOption]
  );

  const removeTimeFilter = useCallback(
    (timeToRemove: number) => {
      changeSearchOption(
        "times",
        searchOptions.times.filter((v) => v !== timeToRemove)
      );
    },
    [changeSearchOption, searchOptions.times]
  );

  const removeMajorFilter = useCallback(
    (majorToRemove: string) => {
      changeSearchOption(
        "majors",
        searchOptions.majors.filter((v) => v !== majorToRemove)
      );
    },
    [changeSearchOption, searchOptions.majors]
  );

  const addSchedule = useCallback(
    (lecture: Lecture) => {
      if (!tableId) return;

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
    [tableId, setSchedulesMap, onClose]
  );

  useEffect(() => {
    const start = performance.now();
    console.log("API 호출 시작: ", start);
    fetchAllLectures().then((results) => {
      const end = performance.now();
      console.log("모든 API 호출 완료 ", end);
      console.log("API 호출에 걸린 시간(ms): ", end - start);
      setLectures(results.flatMap((result) => result.data));
    });
  }, []);

  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => Math.min(lastPage, prevPage + 1));
        }
      },
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: initialDay ? [initialDay] : [],
      times: initialTime ? [initialTime] : [],
    }));
    setPage(1);
  }, [initialDay, initialTime]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <SearchInput
                query={searchOptions.query}
                handleQueryChange={handleQueryChange}
              />
              <SelectCredit
                credits={searchOptions.credits}
                handleCreditsChange={handleCreditsChange}
              />
            </HStack>

            <HStack spacing={4}>
              <SelectGrade
                grades={searchOptions.grades}
                handleGradesChange={handleGradesChange}
              />
              <SelectDay
                days={searchOptions.days}
                handleDaysChange={handleDaysChange}
              />
            </HStack>

            <HStack spacing={4}>
              <SelectTime
                times={searchOptions.times}
                handleTimesChange={handleTimesChange}
                removeTimeFilter={removeTimeFilter}
              />

              <SelectMajor
                majors={searchOptions.majors}
                handleMajorsChange={handleMajorsChange}
                removeMajorFilter={removeMajorFilter}
                allMajors={allMajors}
              />
            </HStack>
            <Text align="right">검색결과: {filteredLectures.length}개</Text>
            <Box>
              <Table>
                <Thead>
                  <Tr>
                    <Th width="100px">과목코드</Th>
                    <Th width="50px">학년</Th>
                    <Th width="200px">과목명</Th>
                    <Th width="50px">학점</Th>
                    <Th width="150px">전공</Th>
                    <Th width="150px">시간</Th>
                    <Th width="80px"></Th>
                  </Tr>
                </Thead>
              </Table>
              <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
                <Table size="sm" variant="striped">
                  <Tbody>
                    {visibleLectures.map((lecture, index) => (
                      <LectureItem
                        key={`${lecture.id}-${index}`}
                        {...lecture}
                        addSchedule={addSchedule}
                      />
                    ))}
                  </Tbody>
                </Table>
                <Box
                  ref={(e) => {
                    loaderRef.current = e;
                  }}
                  h="20px"
                />
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default memo(SearchDialog);
