import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useScheduleContext } from "../../ScheduleContext.tsx";
import { Lecture } from "../../types.ts";
import { parseSchedule } from "../../utils.ts";
import axios from "axios";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import QueryFilter from "./QueryFilter.tsx";
import CreditsFilter from "./CreditsFilter.tsx";
import GradesFilter from "./GradesFilter.tsx";
import DaysFilter from "./DaysFilter.tsx";
import TimesFilter from "./TimesFilter.tsx";
import MajorsFilter from "./MajorsFilter.tsx";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

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
// const fetchAllLectures = async () =>
//   await Promise.all([
//     (console.log("API Call 1", performance.now()), await fetchMajors()),
//     (console.log("API Call 2", performance.now()), await fetchLiberalArts()),
//     (console.log("API Call 3", performance.now()), await fetchMajors()),
//     (console.log("API Call 4", performance.now()), await fetchLiberalArts()),
//     (console.log("API Call 5", performance.now()), await fetchMajors()),
//     (console.log("API Call 6", performance.now()), await fetchLiberalArts()),
//   ]);

// 이미 호출한 api는 다시 호출하지 않도록 - 클로저를 이용하여 캐시 구성
const fetchAllLectures = async (): Promise<Lecture[]> => {
  console.log("API 호출 시작:", performance.now());
  const [majorsData, liberalData] = await Promise.all([
    (console.log("API Call 1", performance.now()), getCachedMajors()),
    (console.log("API Call 2", performance.now()), getCachedLiberalArts()),
    (console.log("API Call 3", performance.now()), getCachedMajors()),
    (console.log("API Call 4", performance.now()), getCachedLiberalArts()),
    (console.log("API Call 5", performance.now()), getCachedMajors()),
    (console.log("API Call 6", performance.now()), getCachedLiberalArts()),
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
    console.log("useEffect 실행됨 - Observer 설정 시작");

    // DOM이 렌더링될 때까지 잠시 기다림
    const timer = setTimeout(() => {
      const $loader = loaderRef.current;
      const $loaderWrapper = loaderWrapperRef.current;

      console.log("loaderRef:", $loader);
      console.log("loaderWrapperRef:", $loaderWrapper);

      if (!$loader || !$loaderWrapper) {
        console.log(
          "loaderRef 또는 loaderWrapperRef가 없어서 Observer 설정 중단"
        );
        return;
      }

      console.log("IntersectionObserver 생성 중...");
      const observer = new IntersectionObserver(
        (entries) => {
          console.log(
            "IntersectionObserver 트리거됨! isIntersecting:",
            entries[0].isIntersecting
          );
          if (entries[0].isIntersecting) {
            console.log("스크롤 감지! 페이지 증가 시작...");
            setPage((prevPage) => {
              const nextPage = prevPage + 1;

              console.log(
                "현재 페이지:",
                prevPage,
                "다음 페이지:",
                nextPage,
                "총 페이지:",
                lastPage
              );

              if (nextPage > lastPage) {
                console.log(
                  "마지막 페이지에 도달했습니다! 현재 페이지:",
                  prevPage,
                  "총 페이지:",
                  lastPage
                );
                return prevPage;
              } else {
                console.log(
                  "무한스크롤 로딩 중... 현재 페이지:",
                  nextPage,
                  "총 페이지:",
                  lastPage
                );
                return nextPage;
              }
            });
          }
        },
        { threshold: 0, root: $loaderWrapper }
      );

      console.log("Observer 설정 완료, $loader 관찰 시작");
      observer.observe($loader);
    }, 100); // 100ms 후에 실행

    return () => {
      clearTimeout(timer);
      console.log("Observer 정리 중...");
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
              <QueryFilter query={query} onChange={handleQueryChange} />
              <CreditsFilter credits={credits} onChange={handleCreditsChange} />
            </HStack>

            <HStack spacing={4}>
              <GradesFilter grades={grades} onChange={handleGradesChange} />
              <DaysFilter days={days} onChange={handleDaysChange} />
            </HStack>

            <HStack spacing={4}>
              <TimesFilter times={times} onChange={handleTimesChange} />
              <MajorsFilter
                majors={majors}
                allMajors={allMajors}
                onChange={handleMajorsChange}
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

              {/* 
              - 컴포넌트 자체가 문제 , 스타일링 자체가 많은 비용을 소모, 테이블에 위임하면 줄어든다
              - 디자인시스템 하는거 좋은데 필요한건지 생각해보자 
              - 컴포넌트로 분리하면서 렝더링을 분리하쟈, 불필요한 분리는 하지 말자*/}
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
