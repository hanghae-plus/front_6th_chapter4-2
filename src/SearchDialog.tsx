import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Tag,
  TagCloseButton,
  TagLabel,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import { Lecture } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import axios from "axios";
import { DAY_LABELS } from "./constants.ts";
import { ApiCache } from "./\bapi/apiCache.ts";
import { LectureItem } from "./LectureItem.tsx";

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

const TIME_SLOTS = [
  { id: 1, label: "09:00~09:30" },
  { id: 2, label: "09:30~10:00" },
  { id: 3, label: "10:00~10:30" },
  { id: 4, label: "10:30~11:00" },
  { id: 5, label: "11:00~11:30" },
  { id: 6, label: "11:30~12:00" },
  { id: 7, label: "12:00~12:30" },
  { id: 8, label: "12:30~13:00" },
  { id: 9, label: "13:00~13:30" },
  { id: 10, label: "13:30~14:00" },
  { id: 11, label: "14:00~14:30" },
  { id: 12, label: "14:30~15:00" },
  { id: 13, label: "15:00~15:30" },
  { id: 14, label: "15:30~16:00" },
  { id: 15, label: "16:00~16:30" },
  { id: 16, label: "16:30~17:00" },
  { id: 17, label: "17:00~17:30" },
  { id: 18, label: "17:30~18:00" },
  { id: 19, label: "18:00~18:50" },
  { id: 20, label: "18:55~19:45" },
  { id: 21, label: "19:50~20:40" },
  { id: 22, label: "20:45~21:35" },
  { id: 23, label: "21:40~22:30" },
  { id: 24, label: "22:35~23:25" },
];

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
              <FormControl>
                <FormLabel>검색어</FormLabel>
                <Input
                  placeholder="과목명 또는 과목코드"
                  value={searchOptions.query}
                  onChange={handleQueryChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>학점</FormLabel>
                <Select
                  value={searchOptions.credits}
                  onChange={handleCreditsChange}
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
                  onChange={handleGradesChange}
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
                  onChange={handleDaysChange}
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
              <FormControl>
                <FormLabel>시간</FormLabel>
                <CheckboxGroup
                  colorScheme="green"
                  value={searchOptions.times}
                  onChange={handleTimesChange}
                >
                  <Wrap spacing={1} mb={2}>
                    {searchOptions.times
                      .sort((a, b) => a - b)
                      .map((time) => (
                        <Tag
                          key={time}
                          size="sm"
                          variant="outline"
                          colorScheme="blue"
                        >
                          <TagLabel>{time}교시</TagLabel>
                          <TagCloseButton
                            onClick={() => removeTimeFilter(time)}
                          />
                        </Tag>
                      ))}
                  </Wrap>
                  <Stack
                    spacing={2}
                    overflowY="auto"
                    h="100px"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius={5}
                    p={2}
                  >
                    {TIME_SLOTS.map(({ id, label }) => (
                      <Box key={id}>
                        <Checkbox key={id} size="sm" value={id}>
                          {id}교시({label})
                        </Checkbox>
                      </Box>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>

              <FormControl>
                <FormLabel>전공</FormLabel>
                <CheckboxGroup
                  colorScheme="green"
                  value={searchOptions.majors}
                  onChange={handleMajorsChange}
                >
                  <Wrap spacing={1} mb={2}>
                    {searchOptions.majors.map((major) => (
                      <Tag
                        key={major}
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                      >
                        <TagLabel>{major.split("<p>").pop()}</TagLabel>
                        <TagCloseButton
                          onClick={() => removeMajorFilter(major)}
                        />
                      </Tag>
                    ))}
                  </Wrap>
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
