import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useSchedulesDispatch } from "./ScheduleContext.tsx";
import { Lecture } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import axios from "axios";
// DAY_LABELS는 SearchFilters에서 사용
import { useDebounce } from "./hooks/useDebounce.ts";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";
import LectureTable from "./LectureTable.tsx";
import SearchFilters from "./SearchFilters.tsx";

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

// TIME_SLOTS는 SearchFilters로 이동

// PAGE_SIZE는 LectureTable로 이동

const fetchMajors = () => axios.get<Lecture[]>("/schedules-majors.json");
const fetchLiberalArts = () =>
  axios.get<Lecture[]>("/schedules-liberal-arts.json");

const createCachedPromise = <T,>(fn: () => Promise<T>) => {
  let cached: Promise<T> | null = null;
  // 캐시가 없을때(최초 1회)만 fetch함수를 실행(api 요청)하고 할당
  return () => (cached ??= fn());
};

const fetchMajorsCached = createCachedPromise(fetchMajors);
const fetchLiberalArtsCached = createCachedPromise(fetchLiberalArts);

// (완료) 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const fetchAllLectures = async (): Promise<Lecture[]> => {
  const [majorsRes, liberalRes] = await Promise.all([
    (console.log("API Call 1", performance.now()), fetchMajorsCached()),
    (console.log("API Call 2", performance.now()), fetchLiberalArtsCached()),
    (console.log("API Call 3", performance.now()), fetchMajorsCached()),
    (console.log("API Call 4", performance.now()), fetchLiberalArtsCached()),
    (console.log("API Call 5", performance.now()), fetchMajorsCached()),
    (console.log("API Call 6", performance.now()), fetchLiberalArtsCached()),
  ]);
  return [...majorsRes.data, ...liberalRes.data];
};

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const setSchedulesMap = useSchedulesDispatch();

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  // 스케줄 파싱 캐시 (필터링용)
  const scheduleCache = useRef(
    new Map<string, ReturnType<typeof parseSchedule>>()
  );

  const getParsedSchedule = (lecture: Lecture) => {
    if (!lecture.schedule) return [];

    if (scheduleCache.current.has(lecture.id))
      return scheduleCache.current.get(lecture.id)!;

    const parsed = parseSchedule(lecture.schedule);
    scheduleCache.current.set(lecture.id, parsed);
    return parsed;
  };

  const debouncedQuery = useDebounce(searchOptions.query);
  const filteredLectures = useMemo(() => {
    const { credits, grades, days, times, majors } = searchOptions;
    const query = debouncedQuery ?? "";
    return lectures
      .filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase())
      )
      .filter(
        (lecture) => grades.length === 0 || grades.includes(lecture.grade)
      )
      .filter(
        (lecture) => majors.length === 0 || majors.includes(lecture.major)
      )
      .filter(
        (lecture) => !credits || lecture.credits.startsWith(String(credits))
      )
      .filter((lecture) => {
        if (days.length === 0) {
          return true;
        }
        const schedules = getParsedSchedule(lecture);
        return schedules.some((s) => days.includes(s.day));
      })
      .filter((lecture) => {
        if (times.length === 0) {
          return true;
        }
        const schedules = getParsedSchedule(lecture);
        return schedules.some((s) =>
          s.range.some((time) => times.includes(time))
        );
      });
  }, [lectures, searchOptions, debouncedQuery]);

  const allMajors = useMemo(
    () => [...new Set(lectures.map((lecture) => lecture.major))],
    [lectures]
  );

  const setQuery = useCallback((query: string) => {
    setSearchOptions((prev) => ({ ...prev, query }));
  }, []);

  const setGrades = useCallback((grades: number[]) => {
    setSearchOptions((prev) => ({ ...prev, grades }));
  }, []);

  const setDays = useCallback((days: string[]) => {
    setSearchOptions((prev) => ({ ...prev, days }));
  }, []);

  const setTimes = useCallback((times: number[]) => {
    setSearchOptions((prev) => ({ ...prev, times }));
  }, []);

  const setMajors = useCallback((majors: string[]) => {
    setSearchOptions((prev) => ({ ...prev, majors }));
  }, []);

  const setCredits = useCallback((credits: number | undefined) => {
    setSearchOptions((prev) => ({ ...prev, credits }));
  }, []);

  const addSchedule = useAutoCallback((lecture: Lecture) => {
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
  });

  useEffect(() => {
    const start = performance.now();
    console.log("API 호출 시작: ", start);
    fetchAllLectures().then((results) => {
      const end = performance.now();
      console.log("모든 API 호출 완료 ", end);
      console.log("API 호출에 걸린 시간(ms): ", end - start);
      setLectures(results);
    });
  }, []);

  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <SearchFilters
              searchOptions={searchOptions}
              onQueryChange={setQuery}
              onGradesChange={setGrades}
              onDaysChange={setDays}
              onTimesChange={setTimes}
              onMajorsChange={setMajors}
              onCreditsChange={setCredits}
              allMajors={allMajors}
            />
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

              <LectureTable lectures={filteredLectures} onAdd={addSchedule} />
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
