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
import axios from "axios";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";

import { useScheduleActions } from "../../Provider/ScheduleProvider.tsx";
import { Lecture } from "../../types.ts";
import {
  collectMatchingUpTo,
  createCachedFetcher,
  parseSchedule,
} from "../../utils.ts";

import { useDebounce } from "../../hooks/useDebounce.ts";
import { SearchControls } from "./SearchControls.tsx";
import { SearchItem } from "./SearchItem.tsx";

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
const base =
  process.env.NODE_ENV === "production" ? "/front_6th_chapter4-2/" : "/";

const fetchMajors = createCachedFetcher(() =>
  axios.get<Lecture[]>(`${base}schedules-majors.json`)
);
const fetchLiberalArts = createCachedFetcher(() =>
  axios.get<Lecture[]>(`${base}schedules-liberal-arts.json`)
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
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleActions();

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
  const debouncedQuery = useDebounce(searchOptions.query, 300);

  // 검색 옵션 + 캐시를 캡처한 매칭 함수
  const filterFn = useMemo(() => {
    const { credits, grades, days, times, majors } = searchOptions;
    const queryText = debouncedQuery?.trim().toLowerCase();
    const gradesSet = grades.length ? new Set(grades) : null;
    const majorsSet = majors.length ? new Set(majors) : null;
    const daysSet = days.length ? new Set(days) : null;
    const timesSet = times.length ? new Set(times) : null;
    const creditsPrefix = credits ? String(credits) : null;

    return (lecture: Lecture) => {
      if (queryText) {
        const title = lecture.title.toLowerCase();
        const idText = lecture.id.toLowerCase();

        if (!title.includes(queryText) && !idText.includes(queryText)) {
          return false;
        }
      }
      if (gradesSet && !gradesSet.has(lecture.grade)) {
        return false;
      }

      if (majorsSet && !majorsSet.has(lecture.major)) {
        return false;
      }
      if (creditsPrefix && !lecture.credits.startsWith(creditsPrefix)) {
        return false;
      }

      if (daysSet || timesSet) {
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule)
          : [];

        if (daysSet && !schedules.some((s) => daysSet.has(s.day))) {
          return false;
        }

        if (
          timesSet &&
          !schedules.some((s) => s.range.some((t) => timesSet.has(t)))
        ) {
          return false;
        }
      }
      return true;
    };
  }, [
    debouncedQuery,
    searchOptions.credits,
    searchOptions.grades,
    searchOptions.days,
    searchOptions.times,
    searchOptions.majors,
  ]);

  const filteredLectures = useMemo(
    () => lectures.filter(filterFn),
    [lectures, filterFn]
  );
  const totalCount = filteredLectures.length;
  const visibleLectures = useMemo(
    () => collectMatchingUpTo(lectures, filterFn, page * PAGE_SIZE), // 첫 화면 빨라짐
    [lectures, filterFn, page]
  );

  const lastPage = useMemo(
    () => Math.ceil(totalCount / PAGE_SIZE),
    [totalCount]
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
              <SearchControls.SearchControl
                query={searchOptions.query}
                changeSearchOption={changeSearchOption}
              />
              <SearchControls.CreditsControl
                credits={searchOptions.credits}
                changeSearchOption={changeSearchOption}
              />
            </HStack>
            <HStack spacing={4}>
              <SearchControls.GradesControl
                grades={searchOptions.grades}
                changeSearchOption={changeSearchOption}
              />

              <SearchControls.DaysControl
                days={searchOptions.days}
                changeSearchOption={changeSearchOption}
              />
            </HStack>

            <HStack spacing={4}>
              <SearchControls.TimesControl
                times={searchOptions.times}
                changeSearchOption={changeSearchOption}
              />

              <SearchControls.MajorsControl
                majors={searchOptions.majors}
                allMajors={allMajors}
                changeSearchOption={changeSearchOption}
              />
            </HStack>
            <Text align="right">검색결과: {totalCount}개</Text>
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
                        addSchedule={addSchedule}
                        {...lecture}
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
