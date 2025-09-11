import { useEffect, useMemo, useRef, useState } from "react";
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
import { useScheduleActions } from "../../context/ScheduleActionsContext.tsx";
import { Lecture, SearchOption } from "../../types.ts";
import { parseSchedule } from "../../utils.ts";
import axios, { AxiosResponse } from "axios";
import { SearchSubjectFilter } from "./SearchFilter/SearchSubjectFilter.tsx";
import { SearchCreditsFilter } from "./SearchFilter/SearchCreditsFilter.tsx";
import { SearchGradesFilter } from "./SearchFilter/SearchGradesFilter.tsx";
import { SearchDaysFilter } from "./SearchFilter/SearchDaysFilter.tsx";
import { SearchTimesFilter } from "./SearchFilter/SearchTimesFilter.tsx";
import { SearchMajorsFilter } from "./SearchFilter/SearchMajorsFilter.tsx";
import { SearchItem } from "./SearchItem.tsx";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import { useSearchHandlers } from "../../hooks/useSearchHandlers.ts";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const PAGE_SIZE = 100;

const createApiCache = () => {
  const cache = new Map<string, Promise<AxiosResponse<Lecture[]>>>();

  return {
    get: (key: string, fetcher: () => Promise<AxiosResponse<Lecture[]>>) => {
      if (!cache.has(key)) {
        console.log(`API Call: ${key}`, performance.now());
        cache.set(key, fetcher());
      }
      return cache.get(key)!;
    },
    clear: () => cache.clear(),
  };
};

const apiCache = createApiCache();

const getBasePath = () => {
  return process.env.NODE_ENV === "production" ? "/front_6th_chapter4-2/" : "/";
};

const fetchMajors = () =>
  apiCache.get("majors", () =>
    axios.get<Lecture[]>(`${getBasePath()}schedules-majors.json`)
  );
const fetchLiberalArts = () =>
  apiCache.get("liberal-arts", () =>
    axios.get<Lecture[]>(`${getBasePath()}schedules-liberal-arts.json`)
  );

const fetchAllLectures = async () => {
  const [majorsResult, liberalArtsResult] = await Promise.all([
    fetchMajors(),
    fetchLiberalArts(),
  ]);

  return [majorsResult, liberalArtsResult];
};

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { addSchedule: addScheduleAction } = useScheduleActions();

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
      setSearchOptions({ ...searchOptions, [field]: value });
      loaderWrapperRef.current?.scrollTo(0, 0);
    }
  );

  const addSchedule = useAutoCallback((lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));

    schedules.forEach((schedule) => {
      addScheduleAction(tableId, schedule);
    });

    onClose();
  });

  const {
    handleQueryChange,
    handleCreditsChange,
    handleDaysChange,
    handleGradesChange,
    handleTimesChange,
    handleMajorsChange,
  } = useSearchHandlers(changeSearchOption);

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
    <Modal
      isOpen={Boolean(searchInfo)}
      onClose={onClose}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent
        maxW="90vw"
        w="1000px"
      >
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack
            spacing={4}
            align="stretch"
          >
            <HStack spacing={4}>
              <SearchSubjectFilter
                searchOptions={searchOptions.query}
                onChange={handleQueryChange}
              />
              <SearchCreditsFilter
                searchOptions={searchOptions.credits}
                onChange={handleCreditsChange}
              />
            </HStack>

            <HStack spacing={4}>
              <SearchGradesFilter
                searchOptions={searchOptions.grades}
                onChange={handleGradesChange}
              />
              <SearchDaysFilter
                searchOptions={searchOptions.days}
                onChange={handleDaysChange}
              />
            </HStack>

            <HStack spacing={4}>
              <SearchTimesFilter
                searchOptions={searchOptions.times}
                onChange={handleTimesChange}
              />
              <SearchMajorsFilter
                searchOptions={searchOptions.majors}
                onChange={handleMajorsChange}
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

              <Box
                overflowY="auto"
                maxH="500px"
                ref={loaderWrapperRef}
              >
                <Table
                  size="sm"
                  variant="striped"
                >
                  <Tbody>
                    {visibleLectures.map((lecture, index) => (
                      <SearchItem
                        key={`${lecture.id}-${index}`}
                        addSchedule={addSchedule}
                        lecture={lecture}
                      />
                    ))}
                  </Tbody>
                </Table>
                <Box
                  ref={loaderRef}
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

export default SearchDialog;
