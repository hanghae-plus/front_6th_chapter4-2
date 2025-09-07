import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
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
import { useScheduleContext } from "./ScheduleContext";
import { Lecture } from "./types";
import { parseSchedule } from "./utils";
import axios from "axios";
import { DAY_LABELS } from "./constants";
import { createCacheManager } from "./libs/cache";

const cacheManager = createCacheManager();
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

const cachedFetchMajors = cacheManager.createCachedFunction(() => axios.get<Lecture[]>("/schedules-majors.json"), {
  ttl: 5000,
  prefix: "schedules-majors",
});

const cachedFetchLiberalArts = cacheManager.createCachedFunction(
  () => axios.get<Lecture[]>("/schedules-liberal-arts.json"),
  {
    ttl: 5000,
    prefix: "schedules-liberal-arts",
  },
);

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
/**
 * API 호출 최적화
 * 1. 중복 API 호출 제거 (6회 → 2회)
 * 2. Promise.all을 사용하여 두 API를 병렬로 호출
 * 3. 불필요한 데이터 변환 작업 최소화
 */
const fetchAllLectures = async () => {
  const start = performance.now();
  console.log("API 호출 시작: ", start);
  
  const [majorsResult, liberalArtsResult] = await Promise.all([
    cachedFetchMajors(),
    cachedFetchLiberalArts()
  ]);
  
  const end = performance.now();
  console.log("API 호출 완료: ", end);
  console.log("API 호출 소요시간(ms): ", end - start);
  
  return [...majorsResult.data, ...liberalArtsResult.data];
};

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
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

  /**
   * 필터링 로직 최적화
   * 1. 모든 필터 조건을 단일 filter 함수로 통합하여 불필요한 배열 순회 제거
   * 2. 검색어 소문자 변환을 한 번만 수행
   * 3. 스케줄 파싱(parseSchedule)을 필요한 경우에만 수행
   * 4. 조건 체크 순서를 최적화 (가벼운 조건을 먼저 체크)
   */
  const filteredLectures = useMemo(() => {
    console.log("필터링 다시 계산");
    const { query = "", credits, grades, days, times, majors } = searchOptions;
    const lowercaseQuery = query.toLowerCase(); // 쿼리 소문자 변환을 한 번만 수행
    
    return lectures
      .filter((lecture) => {
        // 1. 가벼운 조건부터 체크 (문자열 비교, 배열 포함 여부)
        if (query) {
          if (
            !lecture.title.toLowerCase().includes(lowercaseQuery) &&
            !lecture.id.toLowerCase().includes(lowercaseQuery)
          ) {
            return false;
          }
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

        // 2. 무거운 연산(parseSchedule)은 필요한 경우에만 수행
        if (days.length > 0 || times.length > 0) {
          const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
          
          if (days.length > 0 && !schedules.some(s => days.includes(s.day))) {
            return false;
          }

          if (times.length > 0 && !schedules.some(s => s.range.some(time => times.includes(time)))) {
            return false;
          }
        }

        return true;
      });
  }, [lectures, searchOptions]);
  
  /**
   * 페이지네이션 최적화
   * 1. lastPage 계산을 메모이제이션하여 불필요한 재계산 방지
   * 2. visibleLectures를 메모이제이션하여 불필요한 배열 슬라이싱 방지
   * 3. 의존성 배열을 최적화하여 필요한 경우에만 재계산
   */
  const lastPage = useMemo(() => Math.ceil(filteredLectures.length / PAGE_SIZE), [filteredLectures.length]);
  const visibleLectures = useMemo(
    () => filteredLectures.slice(0, page * PAGE_SIZE),
    [filteredLectures, page]
  );
  const allMajors = useMemo(() => [...new Set(lectures.map((lecture) => lecture.major))], [lectures]);

  /**
   * 검색 입력 최적화
   * 1. 검색어 입력에 300ms 디바운스 적용하여 불필요한 상태 업데이트 및 리렌더링 방지
   * 2. 디바운스는 검색어 입력에만 적용 (체크박스 등 다른 필터는 즉시 적용)
   * 3. useCallback을 사용하여 불필요한 함수 재생성 방지
   */
  const debouncedSetSearchOptions = useCallback(
    debounce((field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
    }, 300),
    []
  );

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      if (field === "query") {
        // 검색어 입력에만 디바운스 적용
        debouncedSetSearchOptions(field, value);
      } else {
        // 다른 필터는 즉시 적용
        setSearchOptions((prev) => ({ ...prev, [field]: value }));
      }
      loaderWrapperRef.current?.scrollTo(0, 0);
    },
    [debouncedSetSearchOptions]
  );

  const addSchedule = (lecture: Lecture) => {
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
  };

  useEffect(() => {
    fetchAllLectures().then((results) => {
      setLectures(results);
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
                  value={searchOptions.query}
                  onChange={(e) => changeSearchOption("query", e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>학점</FormLabel>
                <Select value={searchOptions.credits} onChange={(e) => changeSearchOption("credits", e.target.value)}>
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
              <FormControl>
                <FormLabel>시간</FormLabel>
                <CheckboxGroup
                  colorScheme="green"
                  value={searchOptions.times}
                  onChange={(values) => changeSearchOption("times", values.map(Number))}
                >
                  <Wrap spacing={1} mb={2}>
                    {searchOptions.times
                      .sort((a, b) => a - b)
                      .map((time) => (
                        <Tag key={time} size="sm" variant="outline" colorScheme="blue">
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
                  onChange={(values) => changeSearchOption("majors", values as string[])}
                >
                  <Wrap spacing={1} mb={2}>
                    {searchOptions.majors.map((major) => (
                      <Tag key={major} size="sm" variant="outline" colorScheme="blue">
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
                      <Tr key={`${lecture.id}-${index}`}>
                        <Td width="100px">{lecture.id}</Td>
                        <Td width="50px">{lecture.grade}</Td>
                        <Td width="200px">{lecture.title}</Td>
                        <Td width="50px">{lecture.credits}</Td>
                        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
                        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
                        <Td width="80px">
                          <Button size="sm" colorScheme="green" onClick={() => addSchedule(lecture)}>
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
};

export default SearchDialog;
