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
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { Lecture, ProcessedLecture, SearchOption } from "../../types";
import { parseSchedule } from "../../lib/utils";
import { DAY_LABELS, PAGE_SIZE } from "../../constants";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import { fetchAllLectures } from "../../lib/api.ts";
import { TimeFilter } from "./TimeFilter.tsx";
import { MajorFilter } from "./MajorFilter.tsx";
import { SearchItem } from "./SearchItem.tsx";
import { useScheduleStore } from "../../store/scheduleStore";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const setSchedulesMap = useScheduleStore((state) => state.setSchedulesMap);

  const observerRef = useRef<IntersectionObserver>(null);
  const loaderWrapperRef = useRef<HTMLDivElement>(null);

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [processedLectures, setProcessedLectures] = useState<ProcessedLecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const debouncedSearchOptions = useDebounce(searchOptions, 300);

  useEffect(() => {
    if (lectures && lectures.length > 0) {
      const parsedData = lectures.map((lecture) => ({
        ...lecture,
        parsedSchedule: lecture.schedule ? parseSchedule(lecture.schedule) : [],
      }));
      setProcessedLectures(parsedData);
    }
  }, [lectures]);

  const filteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = debouncedSearchOptions;
    return processedLectures
      .filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase())
      )
      .filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
      .filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
      .filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
      .filter((lecture) => {
        if (days.length === 0) return true;
        return lecture.parsedSchedule.some((s) => days.includes(s.day));
      })
      .filter((lecture) => {
        if (times.length === 0) return true;
        return lecture.parsedSchedule.some((s) => s.range.some((t) => times.includes(t)));
      });
  }, [processedLectures, debouncedSearchOptions]);

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);
  const allMajors = useMemo(() => {
    return [...new Set(lectures.map((lecture) => lecture.major))];
  }, [lectures]);

  const hasMore = page < lastPage;

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: any) => {
      setPage(1);
      setSearchOptions((prevOptions) => ({ ...prevOptions, [field]: value }));
    },
    [setSearchOptions]
  );

  const loaderRef = useCallback(
    (node: HTMLDivElement) => {
      const observer = observerRef.current;
      if (observer) {
        observer.disconnect();
        if (node) {
          observer.observe(node);
        }
      }
    },
    [observerRef.current]
  );

  const addSchedule = useAutoCallback((lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));

    setSchedulesMap((prev: any) => {
      return {
        ...prev,
        [tableId]: [...prev[tableId], schedules],
      };
    });

    onClose();
  });

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

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    observerRef.current = observer;
  }, [handleLoadMore]);

  useEffect(() => {
    if (searchInfo) {
      setSearchOptions((prev) => ({
        ...prev,
        days: searchInfo?.day ? [searchInfo.day] : [],
        times: searchInfo?.time ? [searchInfo.time] : [],
      }));
      setPage(1);
    }
  }, [searchInfo]);

  useEffect(() => {
    if (page === 1) {
      loaderWrapperRef.current?.scrollTo(0, 0);
    }
  }, [page, filteredLectures.length]);

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
                <Input
                  placeholder="과목명 또는 과목코드"
                  value={searchOptions.query}
                  onChange={(e) => changeSearchOption("query", e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>학점</FormLabel>
                <Select
                  value={searchOptions.credits}
                  onChange={(e) => changeSearchOption("credits", e.target.value)}
                >
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
                <CheckboxGroup
                  value={searchOptions.grades}
                  onChange={(value) => changeSearchOption("grades", value.map(Number))}
                >
                  <HStack spacing={4}>
                    {[1, 2, 3, 4].map((grade) => (
                      <Checkbox key={grade} value={grade}>
                        {grade}학년
                      </Checkbox>
                    ))}
                  </HStack>
                </CheckboxGroup>
              </FormControl>

              <FormControl>
                <FormLabel>요일</FormLabel>
                <CheckboxGroup
                  value={searchOptions.days}
                  onChange={(value) => changeSearchOption("days", value as string[])}
                >
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
              <TimeFilter selectedTimes={searchOptions.times} onChange={changeSearchOption} />
              <MajorFilter
                allMajors={allMajors}
                selectedMajors={searchOptions.majors}
                onChange={changeSearchOption}
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
                      <SearchItem
                        key={`${lecture.id}-${index}`}
                        {...lecture}
                        addSchedule={addSchedule}
                      />
                    ))}
                  </Tbody>
                </Table>
                {hasMore && <Box ref={loaderRef} h="20px" />}
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
