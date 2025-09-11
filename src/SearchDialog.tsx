import {
  Box,
  Button,
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
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import axios from "axios";
import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { DAY_LABELS } from "./constants";
import { useScheduleContext } from "./ScheduleContext";
import { Lecture } from "./types.ts";
import { createCache, parseSchedule } from "./utils";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

interface SearchOption {
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: string;
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

const LectureRow = memo(({ lecture, onAdd }: { lecture: Lecture & { parsedSchedule: any[] }, onAdd: (lecture: Lecture) => void }) => (
  <Tr>
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
        onClick={() => onAdd(lecture)}
      >
        추가
      </Button>
    </Td>
  </Tr>
));

const MajorCheckbox = memo(({ major, isSelected, onChange }: { major: string, isSelected: boolean, onChange: (major: string, checked: boolean) => void }) => (
  <Box>
    <Checkbox 
      size="sm" 
      value={major}
      isChecked={isSelected}
      onChange={(e) => onChange(major, e.target.checked)}
    >
      {major.replace(/<p>/gi, " ")}
    </Checkbox>
  </Box>
));

const TimeSlotCheckbox = memo(({ timeSlot, isSelected, onChange }: { 
  timeSlot: { id: number, label: string }, 
  isSelected: boolean, 
  onChange: (timeId: number, checked: boolean) => void 
}) => (
  <Box>
    <Checkbox 
      size="sm" 
      value={timeSlot.id}
      isChecked={isSelected}
      onChange={(e) => onChange(timeSlot.id, e.target.checked)}
    >
      {timeSlot.id}교시({timeSlot.label})
    </Checkbox>
  </Box>
));

const fetchMajors = createCache(() =>
  axios.get<Lecture[]>("/schedules-majors.json"),
);

const fetchLiberalArts = createCache(() =>
  axios.get<Lecture[]>("/schedules-liberal-arts.json"),
);

/**
 * TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
 *
 * * 1. createCache 를 사용해 중복 호출을 캐시로 처리
 * * 2. Promise 사용시 await을 제거하여 올바른 Promise.all 사용
 */
const fetchAllLectures = async () =>
  await Promise.all([
    (console.log("API Call 1", performance.now()), fetchMajors()),
    (console.log("API Call 2", performance.now()), fetchLiberalArts()),
    (console.log("API Call 3", performance.now()), fetchMajors()),
    (console.log("API Call 4", performance.now()), fetchLiberalArts()),
    (console.log("API Call 5", performance.now()), fetchMajors()),
    (console.log("API Call 6", performance.now()), fetchLiberalArts()),
  ]);

/**
 * TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
 *
 * * 1. useMemo, useCallback 적용
 * * 3. setSearchOptions prevValue 사용
 * * 3. 필터 순회 1번으로 변경
 */
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const lecturesWithSchedules = useMemo(
    () =>
      lectures.map((lecture) => ({
        ...lecture,
        parsedSchedule: lecture.schedule ? parseSchedule(lecture.schedule) : [],
      })),
    [lectures],
  );

  const filteredLectures = useMemo(() => {
    const { credits, grades, days, times, majors } = searchOptions;
    return lecturesWithSchedules.filter((lecture) => {
      // 1. 검색어 필터 (제목 또는 과목코드)
      if (
        deferredSearchQuery &&
        !lecture.title.toLowerCase().includes(deferredSearchQuery.toLowerCase()) &&
        !lecture.id.toLowerCase().includes(deferredSearchQuery.toLowerCase())
      ) {
        return false;
      }

      // 2. 학년 필터
      if (grades.length > 0 && !grades.includes(lecture.grade)) {
        return false;
      }

      // 3. 전공 필터
      if (majors.length > 0 && !majors.includes(lecture.major)) {
        return false;
      }

      // 4. 학점 필터
      if (credits && !lecture.credits.startsWith(String(credits))) {
        return false;
      }

      // 5. 요일 필터
      if (
        days.length > 0 &&
        !lecture.parsedSchedule.some((s) => days.includes(s.day))
      ) {
        return false;
      }

      // 6. 시간 필터
      if (
        times.length > 0 &&
        !lecture.parsedSchedule.some((s) =>
          s.range.some((time) => times.includes(time)),
        )
      ) {
        return false;
      }

      return true;
    });
  }, [lecturesWithSchedules, deferredSearchQuery, searchOptions]);

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE)

  const visibleLectures = useMemo(
    () => filteredLectures.slice(0, page * PAGE_SIZE),
    [filteredLectures, page],
  );
  
  const allMajors = useMemo(
    () => [...new Set(lectures.map((lecture) => lecture.major))],
    [lectures],
  );

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions(prev => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    },
    [],
  );

  const handleMajorChange = useCallback(
    (major: string, checked: boolean) => {
      const newMajors = checked 
        ? [...searchOptions.majors, major]
        : searchOptions.majors.filter(m => m !== major);
      changeSearchOption("majors", newMajors);
    },
    [searchOptions.majors, changeSearchOption],
  );

  const handleTimeSlotChange = useCallback(
    (timeId: number, checked: boolean) => {
      const newTimes = checked 
        ? [...searchOptions.times, timeId]
        : searchOptions.times.filter(t => t !== timeId);
      changeSearchOption("times", newTimes);
    },
    [searchOptions.times, changeSearchOption],
  );

  const addSchedule = useCallback(
    (lecture: Lecture) => {
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
    [searchInfo, onClose, setSchedulesMap],
  );

  useEffect(() => {
    const start = performance.now();
    console.log("API 호출 시작: ", start);
    fetchAllLectures().then((results) => {
      const end = performance.now();
      console.log("모든 API 호출 완료 ", end);
      console.log("API 호출에 걸린 시간(ms): ", end - start);
      
      const allData = results.flatMap((result) => result.data);
      const uniqueLectures = Array.from(
        new Map(allData.map(lecture => [lecture.id, lecture])).values()
      );
      
      setLectures(uniqueLectures);
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
              <FormControl>
                <FormLabel>검색어</FormLabel>
                <Input
                  placeholder="과목명 또는 과목코드"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>학점</FormLabel>
                <Select
                  value={searchOptions.credits}
                  onChange={(e) =>
                    changeSearchOption("credits", e.target.value)
                  }
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
                  onChange={(value) =>
                    changeSearchOption("grades", value.map(Number))
                  }
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
                  onChange={(value) =>
                    changeSearchOption("days", value as string[])
                  }
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
                  onChange={(values) =>
                    changeSearchOption("times", values.map(Number))
                  }
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
                            onClick={() =>
                              changeSearchOption(
                                "times",
                                searchOptions.times.filter((v) => v !== time),
                              )
                            }
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
                    {TIME_SLOTS.map((timeSlot) => (
                      <TimeSlotCheckbox
                        key={timeSlot.id}
                        timeSlot={timeSlot}
                        isSelected={searchOptions.times.includes(timeSlot.id)}
                        onChange={handleTimeSlotChange}
                      />
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>

              <FormControl>
                <FormLabel>전공</FormLabel>
                <CheckboxGroup
                  colorScheme="green"
                  value={searchOptions.majors}
                  onChange={(values) =>
                    changeSearchOption("majors", values as string[])
                  }
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
                          onClick={() =>
                            changeSearchOption(
                              "majors",
                              searchOptions.majors.filter((v) => v !== major),
                            )
                          }
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
                      <MajorCheckbox
                        key={major}
                        major={major}
                        isSelected={searchOptions.majors.includes(major)}
                        onChange={handleMajorChange}
                      />
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
                    {visibleLectures.map((lecture) => (
                      <LectureRow
                        key={lecture.id}
                        lecture={lecture}
                        onAdd={addSchedule}
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
