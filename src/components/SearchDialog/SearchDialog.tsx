import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Lecture } from "../../types.ts";
import { parseSchedule } from "../../utils.ts";
import axios from "axios";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import { useScheduleContext } from "../../ScheduleContext.tsx";
import { DAY_LABELS } from "../../constants.ts";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
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

const fetchMajors = () => axios.get<Lecture[]>("/schedules-majors.json");
const fetchLiberalArts = () =>
  axios.get<Lecture[]>("/schedules-liberal-arts.json");

// 전역 캐시 - 컴포넌트 외부에서 관리하여 함수 호출 시마다 새 캐시가 생성되지 않도록 함
const apiCache = new Map<string, Promise<Lecture[]>>();

const getCachedMajors = () => {
  if (!apiCache.has("majors")) {
    console.log("API Call majors start", performance.now());
    apiCache.set(
      "majors",
      fetchMajors().then((res) => res.data)
    );
  }
  return apiCache.get("majors")!;
};

const getCachedLiberalArts = () => {
  if (!apiCache.has("liberal-arts")) {
    console.log("API Call liberal-arts start", performance.now());
    apiCache.set(
      "liberal-arts",
      fetchLiberalArts().then((res) => res.data)
    );
  }
  return apiCache.get("liberal-arts")!;
};

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
// 최적화 전 (잘못된 코드 - 직렬 실행 + 중복 호출)
// const fetchAllLectures = async () => await Promise.all([
//   (console.log('API Call 1', performance.now()), await fetchMajors()),
//   (console.log('API Call 2', performance.now()), await fetchLiberalArts()),
//   (console.log('API Call 3', performance.now()), await fetchMajors()),
//   (console.log('API Call 4', performance.now()), await fetchLiberalArts()),
//   (console.log('API Call 5', performance.now()), await fetchMajors()),
//   (console.log('API Call 6', performance.now()), await fetchLiberalArts()),
// ]);

// 최적화 후 (올바른 코드 - 병렬 실행 + 캐시 활용)
const fetchAllLectures = async (): Promise<Lecture[]> => {
  console.log("API 호출 시작:", performance.now());

  // Promise.all로 병렬 실행 - 각 API는 한 번씩만 호출
  const [majorsData, liberalData] = await Promise.all([
    getCachedMajors(), // 캐시된 전공 데이터
    getCachedLiberalArts(), // 캐시된 교양 데이터
  ]);

  console.log("모든 API 호출 완료", performance.now());
  return [...majorsData, ...liberalData];
};

const SearchItem = memo(
  ({
    addSchedule,
    lecture,
  }: {
    lecture: Lecture;
    addSchedule: (lecture: Lecture) => void;
  }) => {
    const { id, grade, title, credits, major, schedule } = lecture;
    return (
      <Tr>
        <Td width="100px">{id}</Td>
        <Td width="50px">{grade}</Td>
        <Td width="200px">{title}</Td>
        <Td width="50px">{credits}</Td>
        <Td width="150px" dangerouslySetInnerHTML={{ __html: major }} />
        <Td width="150px" dangerouslySetInnerHTML={{ __html: schedule }} />
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
    );
  }
);
SearchItem.displayName = "SearchItem";

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);

  // 각 필터를 별도 상태로 관리
  const [query, setQuery] = useState("");
  const [credits, setCredits] = useState<number | undefined>(undefined);
  const [grades, setGrades] = useState<number[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [times, setTimes] = useState<number[]>([]);
  const [majors, setMajors] = useState<string[]>([]);

  const filteredLectures = useMemo(() => {
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
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule)
          : [];
        return schedules.some((s) => days.includes(s.day));
      })
      .filter((lecture) => {
        if (times.length === 0) {
          return true;
        }
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule)
          : [];
        return schedules.some((s) =>
          s.range.some((time) => times.includes(time))
        );
      });
  }, [lectures, query, credits, grades, days, times, majors]);

  const lastPage = useMemo(
    () => Math.ceil(filteredLectures.length / PAGE_SIZE),
    [filteredLectures.length]
  );

  const visibleLectures = useMemo(
    () => filteredLectures.slice(0, page * PAGE_SIZE),
    [filteredLectures, page]
  );

  const allMajors = useMemo(
    () => [...new Set(lectures.map((lecture) => lecture.major))],
    [lectures]
  );

  // 각 필터별 핸들러 함수들 - useCallback으로 메모이제이션
  const handleQueryChange = useCallback((value: string) => {
    setPage(1);
    setQuery(value);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const handleCreditsChange = useCallback((value: string) => {
    setPage(1);
    setCredits(value ? Number(value) : undefined);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const handleGradesChange = useCallback((values: number[]) => {
    setPage(1);
    setGrades(values);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const handleDaysChange = useCallback((values: string[]) => {
    setPage(1);
    setDays(values);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const handleTimesChange = useCallback((values: number[]) => {
    setPage(1);
    setTimes(values);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const handleMajorsChange = useCallback((values: string[]) => {
    setPage(1);
    setMajors(values);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  // 각 필터 섹션을 useMemo로 메모이제이션하여 독립적인 리렌더링 보장
  const querySection = useMemo(
    () => (
      <FormControl>
        <FormLabel>검색어</FormLabel>
        <Input
          placeholder="과목명 또는 과목코드"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
        />
      </FormControl>
    ),
    [query, handleQueryChange]
  );

  const creditsSection = useMemo(
    () => (
      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select
          value={credits || ""}
          onChange={(e) => handleCreditsChange(e.target.value)}
        >
          <option value="">전체</option>
          <option value="1">1학점</option>
          <option value="2">2학점</option>
          <option value="3">3학점</option>
        </Select>
      </FormControl>
    ),
    [credits, handleCreditsChange]
  );

  const gradesSection = useMemo(
    () => (
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup
          value={grades}
          onChange={(value) => handleGradesChange(value.map(Number))}
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
    ),
    [grades, handleGradesChange]
  );

  const daysSection = useMemo(
    () => (
      <FormControl>
        <FormLabel>요일</FormLabel>
        <CheckboxGroup
          value={days}
          onChange={(value) => handleDaysChange(value as string[])}
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
    ),
    [days, handleDaysChange]
  );

  const timesSection = useMemo(
    () => (
      <FormControl>
        <FormLabel>시간</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={times}
          onChange={(values) => handleTimesChange(values.map(Number))}
        >
          <Wrap spacing={1} mb={2}>
            {times
              .sort((a, b) => a - b)
              .map((time) => (
                <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                  <TagLabel>{time}교시</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      handleTimesChange(times.filter((v) => v !== time))
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
    ),
    [times, handleTimesChange]
  );

  const majorsSection = useMemo(
    () => (
      <FormControl>
        <FormLabel>전공</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={majors}
          onChange={(values) => handleMajorsChange(values as string[])}
        >
          <Wrap spacing={1} mb={2}>
            {majors.map((major) => (
              <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{major.split("<p>").pop()}</TagLabel>
                <TagCloseButton
                  onClick={() =>
                    handleMajorsChange(majors.filter((v) => v !== major))
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
              <Box key={major}>
                <Checkbox key={major} size="sm" value={major}>
                  {major.replace(/<p>/gi, " ")}
                </Checkbox>
              </Box>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>
    ),
    [majors, allMajors, handleMajorsChange]
  );

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
    // DOM이 렌더링될 때까지 잠시 기다림
    const timer = setTimeout(() => {
      const $loader = loaderRef.current;
      const $loaderWrapper = loaderWrapperRef.current;

      if (!$loader || !$loaderWrapper) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => {
              const nextPage = prevPage + 1;

              if (nextPage > lastPage) {
                return prevPage;
              } else {
                return nextPage;
              }
            });
          }
        },
        { threshold: 0, root: $loaderWrapper }
      );

      observer.observe($loader);
    }, 100); // 100ms 후에 실행

    return () => {
      clearTimeout(timer);
    };
  }, [searchInfo, lastPage]);

  useEffect(() => {
    if (searchInfo) {
      setDays(searchInfo.day ? [searchInfo.day] : []);
      setTimes(searchInfo.time ? [searchInfo.time] : []);
      setPage(1);
    }
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
              {querySection}
              {creditsSection}
            </HStack>

            <HStack spacing={4}>
              {gradesSection}
              {daysSection}
            </HStack>

            <HStack spacing={4}>
              {timesSection}
              {majorsSection}
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
                        lecture={lecture}
                        addSchedule={addSchedule}
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
