import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

import GradeCheckboxes from "./components/GradeCheckboxes.tsx";
import SelectedTimeTags from "./components/SelectedTimeTags.tsx";
import TimeSlotCheckboxes from "./components/TimeSlotCheckboxes.tsx";
import SelectedMajorTags from "./components/SelectedMajorTags.tsx";
import SearchResultCount from "./components/SearchResultCount.tsx";
import LectureRow from "./components/LectureRow.tsx";

import { useScheduleContext } from "../ScheduleContext.tsx";

import { parseSchedule } from "../utils.ts";
import axios from "axios";
import { DAY_LABELS } from "../constants.ts";
import { cache } from "../libs/cache.ts";

import type { Lecture } from "../types.ts";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

// SearchOption 인터페이스는 제거하고 개별 상태로 관리

const PAGE_SIZE = 100;

const SCHEDULES_MAJORS = "/schedules-majors.json";
const SCHEDULES_LIBERAL_ARTS = "/schedules-liberal-arts.json";

const fetchMajors = () => {
  if (cache.has(SCHEDULES_MAJORS)) {
    return cache.get(SCHEDULES_MAJORS);
  }

  const promise = axios.get<Lecture[]>(SCHEDULES_MAJORS);

  cache.set(SCHEDULES_MAJORS, promise);

  return promise;
};

const fetchLiberalArts = () => {
  if (cache.has(SCHEDULES_LIBERAL_ARTS)) {
    return cache.get(SCHEDULES_LIBERAL_ARTS);
  }

  const promise = axios.get<Lecture[]>(SCHEDULES_LIBERAL_ARTS);

  cache.set(SCHEDULES_LIBERAL_ARTS, promise);

  return promise;
};

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const fetchAllLectures = async () => {
  return await Promise.all([
    (console.log("API Call 1", performance.now()), fetchMajors()),
    (console.log("API Call 2", performance.now()), fetchLiberalArts()),
  ]);
};

const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);

  // 개별 상태들로 분리
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [credits, setCredits] = useState<string>("");
  const [grades, setGrades] = useState<number[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [times, setTimes] = useState<number[]>([]);
  const [majors, setMajors] = useState<string[]>([]);

  // parseSchedule 메모이제이션 + 검색을 위한 소문자 변환 미리 처리
  const lecturesWithParsedSchedule = useMemo(
    () =>
      lectures.map((lecture) => ({
        ...lecture,
        parsedSchedule: lecture.schedule ? parseSchedule(lecture.schedule) : [],
        // 검색 성능을 위해 미리 소문자로 변환
        titleLower: lecture.title.toLowerCase(),
        idLower: lecture.id.toLowerCase(),
      })),
    [lectures],
  );

  // 배열을 Set으로 변환하여 O(1) 검색 성능 확보
  const gradesSet = useMemo(() => new Set(grades), [grades]);
  const daysSet = useMemo(() => new Set(days), [days]);
  const timesSet = useMemo(() => new Set(times), [times]);
  const majorsSet = useMemo(() => new Set(majors), [majors]);

  // 검색어를 미리 소문자로 변환하여 반복 연산 방지
  const normalizedQuery = useMemo(() => debouncedQuery.toLowerCase().trim(), [debouncedQuery]);

  // 디바운싱을 위한 useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timer);
  }, [query]);

  // getFilteredLectures 제거하고 직접 useMemo 사용
  const filteredLectures = useMemo(() => {
    return lecturesWithParsedSchedule
      .filter((lecture) => {
        if (!normalizedQuery) return true; // 빈 검색어면 필터링 생략
        return lecture.titleLower.includes(normalizedQuery) || lecture.idLower.includes(normalizedQuery);
      })
      .filter((lecture) => gradesSet.size === 0 || gradesSet.has(lecture.grade))
      .filter((lecture) => majorsSet.size === 0 || majorsSet.has(lecture.major))
      .filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
      .filter((lecture) => {
        if (daysSet.size === 0) {
          return true;
        }
        return lecture.parsedSchedule.some((s) => daysSet.has(s.day));
      })
      .filter((lecture) => {
        if (timesSet.size === 0) {
          return true;
        }
        return lecture.parsedSchedule.some((s) => s.range.some((time) => timesSet.has(time)));
      });
  }, [lecturesWithParsedSchedule, normalizedQuery, credits, gradesSet, daysSet, timesSet, majorsSet]);

  const lastPage = useMemo(() => Math.ceil(filteredLectures.length / PAGE_SIZE), [filteredLectures]);
  const visibleLectures = useMemo(() => filteredLectures.slice(0, page * PAGE_SIZE), [filteredLectures, page]);

  const allMajors = useMemo(() => [...new Set(lectures.map((lecture) => lecture.major))], [lectures]);

  const resetPage = useCallback(() => {
    setPage(1);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const addSchedule = useCallback(
    (
      lecture: Lecture & {
        parsedSchedule: { day: string; range: number[]; room: string }[];
        titleLower: string;
        idLower: string;
      },
    ) => {
      if (!searchInfo) return;

      const { tableId } = searchInfo;

      const schedules = lecture.parsedSchedule.map((schedule) => ({
        ...schedule,
        lecture,
      }));

      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: [...prev[tableId], ...schedules],
      }));

      onClose();
    },
    [searchInfo, setSchedulesMap, onClose],
  );

  // onChange 핸들러들 최적화
  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      resetPage();
    },
    [resetPage],
  );

  const handleCreditsChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCredits(e.target.value);
      resetPage();
    },
    [resetPage],
  );

  const handleGradesChange = useCallback(
    (value: (string | number)[]) => {
      setGrades(value.map(Number));
      resetPage();
    },
    [resetPage],
  );

  const handleDaysChange = useCallback(
    (value: (string | number)[]) => {
      setDays(value as string[]);
      resetPage();
    },
    [resetPage],
  );

  const handleTimesChange = useCallback(
    (values: (string | number)[]) => {
      setTimes(values.map(Number));
      resetPage();
    },
    [resetPage],
  );

  const handleMajorsChange = useCallback(
    (values: (string | number)[]) => {
      setMajors(values as string[]);
      resetPage();
    },
    [resetPage],
  );

  // Tag 제거 핸들러들 최적화
  const handleRemoveTime = useCallback(
    (timeToRemove: number) => {
      setTimes((prev) => prev.filter((time) => time !== timeToRemove));
      resetPage();
    },
    [resetPage],
  );

  const handleRemoveMajor = useCallback(
    (majorToRemove: string) => {
      setMajors((prev) => prev.filter((major) => major !== majorToRemove));
      resetPage();
    },
    [resetPage],
  );

  useEffect(() => {
    const start = performance.now();
    console.log("API 호출 시작: ", start);
    fetchAllLectures().then((results) => {
      const end = performance.now();

      console.log("모든 API 호출 완료 ", end);
      console.log("API 호출에 걸린 시간(ms): ", end - start);

      setLectures(results.flatMap((result) => result?.data ?? []));
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
      { threshold: 0, root: $loaderWrapper },
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  useEffect(() => {
    setDays(searchInfo?.day ? [searchInfo.day] : []);
    setTimes(searchInfo?.time ? [searchInfo.time] : []);
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
              <FormControl>
                <FormLabel>검색어</FormLabel>
                <Input placeholder="과목명 또는 과목코드" value={query} onChange={handleQueryChange} />
              </FormControl>

              <FormControl>
                <FormLabel>학점</FormLabel>
                <Select value={credits} onChange={handleCreditsChange}>
                  <option value="">전체</option>
                  <option value="1">1학점</option>
                  <option value="2">2학점</option>
                  <option value="3">3학점</option>
                </Select>
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>학년</FormLabel>
                <CheckboxGroup value={grades} onChange={handleGradesChange}>
                  <HStack spacing={4}>
                    <GradeCheckboxes />
                  </HStack>
                </CheckboxGroup>
              </FormControl>

              <FormControl>
                <FormLabel>요일</FormLabel>
                <CheckboxGroup value={days} onChange={handleDaysChange}>
                  <HStack spacing={4}>
                    {DAY_LABELS.map((day) => (
                      <Checkbox key={day} value={day}>
                        {day}
                      </Checkbox>
                    ))}
                  </HStack>
                </CheckboxGroup>
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>시간</FormLabel>
                <CheckboxGroup colorScheme="green" value={times} onChange={handleTimesChange}>
                  <SelectedTimeTags times={times} onRemove={handleRemoveTime} />
                  <Stack
                    spacing={2}
                    overflowY="auto"
                    h="100px"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius={5}
                    p={2}
                  >
                    <TimeSlotCheckboxes />
                  </Stack>
                </CheckboxGroup>
              </FormControl>

              <FormControl>
                <FormLabel>전공</FormLabel>
                <CheckboxGroup colorScheme="green" value={majors} onChange={handleMajorsChange}>
                  <SelectedMajorTags majors={majors} onRemove={handleRemoveMajor} />
                  <Stack
                    spacing={2}
                    overflowY="auto"
                    h="100px"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius={5}
                    p={2}
                  >
                    {allMajors.map((major) => (
                      <Box key={major}>
                        <Checkbox key={major} size="sm" value={major}>
                          {major.replace(/<p>/gi, " ")}
                        </Checkbox>
                      </Box>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>
            </HStack>
            <SearchResultCount count={filteredLectures.length} />
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
                      <LectureRow
                        key={`${lecture.id}-${index}`}
                        lecture={lecture}
                        index={index}
                        onAddSchedule={addSchedule}
                      />
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
};

export default SearchDialog;
