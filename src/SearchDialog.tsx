import { useEffect, useMemo, useRef, useState, memo } from "react";
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
import { useAutoCallback } from "./hooks/useAutoCallback.ts";
import SearchForm from "./components/SearchDialog/SearchForm.tsx";
import GradesForm from "./components/SearchDialog/GradesForm.tsx";
import DaysForm from "./components/SearchDialog/DaysForm.tsx";
import TimesForm from "./components/SearchDialog/TimesForm.tsx";
import MajorsForm from "./components/SearchDialog/MajorsForm.tsx";
import CreditsForm from "./components/SearchDialog/CreditsForm.tsx";
import LectureRow from "./components/SearchDialog/LectureRow.tsx";

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

const PAGE_SIZE = 100;

// API 캐시 시스템
const createApiCache = () => {
  const cache = new Map<string, Promise<{ data: Lecture[] }>>();

  return (key: string, fetcher: () => Promise<{ data: Lecture[] }>) => {
    if (cache.has(key)) {
      return cache.get(key) as Promise<{ data: Lecture[] }>;
    }

    const promise = fetcher();
    cache.set(key, promise);
    return promise;
  };
};

const apiCache = createApiCache();

const fetchMajors = () =>
  apiCache("majors", () => axios.get<Lecture[]>("./schedules-majors.json"));
const fetchLiberalArts = () =>
  apiCache("liberalArts", () =>
    axios.get<Lecture[]>("./schedules-liberal-arts.json")
  );

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const fetchAllLectures = async () =>
  await Promise.all([
    (console.log("API Call 1", performance.now()), fetchMajors()),
    (console.log("API Call 2", performance.now()), fetchLiberalArts()),
    (console.log("API Call 3", performance.now()), fetchMajors()),
    (console.log("API Call 4", performance.now()), fetchLiberalArts()),
    (console.log("API Call 5", performance.now()), fetchMajors()),
    (console.log("API Call 6", performance.now()), fetchLiberalArts()),
  ]);

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = memo(({ searchInfo, onClose }: Props) => {
  const { addSchedule } = useScheduleContext();

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

  const filteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;
    
    if (lectures.length === 0) return [];
    
    const lowerQuery = query.toLowerCase();
    
    return lectures.filter((lecture) => {
      if (query && 
          !lecture.title.toLowerCase().includes(lowerQuery) && 
          !lecture.id.toLowerCase().includes(lowerQuery)) {
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
      
      if (days.length > 0 || times.length > 0) {
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        
        if (days.length > 0 && !schedules.some((s) => days.includes(s.day))) {
          return false;
        }
        
        if (times.length > 0 && !schedules.some((s) => s.range.some((time) => times.includes(time)))) {
          return false;
        }
      }
      
      return true;
    });
  }, [lectures, searchOptions]);

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

  const changeSearchOption = useAutoCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    }
  );

  const handleAddSchedule = useAutoCallback((lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;
    addSchedule(tableId, lecture);
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
              <SearchForm
                query={searchOptions.query}
                changeSearchOption={changeSearchOption}
              />
              <CreditsForm
                credits={searchOptions.credits}
                changeSearchOption={changeSearchOption}
              />
            </HStack>

            <HStack spacing={4}>
              <GradesForm
                grades={searchOptions.grades}
                changeSearchOption={changeSearchOption}
              />
              <DaysForm
                days={searchOptions.days}
                changeSearchOption={changeSearchOption}
              />
            </HStack>

            <HStack spacing={4}>
              <TimesForm
                times={searchOptions.times}
                changeSearchOption={changeSearchOption}
              />
              <MajorsForm
                majors={searchOptions.majors}
                allMajors={allMajors}
                changeSearchOption={changeSearchOption}
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
                  <Tbody
                    sx={{
                      button: {
                        bg: "green.500",
                        color: "white",
                        size: "sm",
                        padding: "6px 12px",
                        _hover: { bg: "green.600" },
                      },
                      "tr:hover": {
                        bg: "gray.50",
                      },
                      td: {
                        fontSize: "14px",
                        padding: "12px",
                      },
                    }}
                  >
                    {visibleLectures.map((lecture, index) => (
                      <LectureRow
                        key={`${lecture.id}-${index}`}
                        lecture={lecture}
                        addSchedule={handleAddSchedule}
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
});

SearchDialog.displayName = "SearchDialog";

export default SearchDialog;
