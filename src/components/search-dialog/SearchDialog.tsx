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
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  MemoizedCreditSelect,
  MemoizedDaySelect,
  MemoizedGradeSelect,
  MemoizedLectureTable,
  MemoizedMajorSelect,
  MemoizedQueryInput,
  MemoizedTimeSelect,
} from "./__private__";
import { PAGE_SIZE } from "../../constants";
import { useScheduleContext } from "../../contexts";
import { LectureService } from "../../services";
import type { Lecture, SearchInfo, SearchOption } from "../../types";
import { parseSchedule } from "../../utils";

interface SearchDialogProps {
  searchInfo: SearchInfo | null;
  onClose: () => void;
}

const INITIAL_SEARCH_OPTIONS: SearchOption = {
  query: "",
  grades: [],
  days: [],
  times: [],
  majors: [],
};

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
export function SearchDialog({ searchInfo, onClose }: SearchDialogProps) {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>(INITIAL_SEARCH_OPTIONS);

  const filteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;

    return lectures
      .filter((lecture) => {
        const matchesQuery =
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase());
        return matchesQuery;
      })
      .filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
      .filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
      .filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
      .filter((lecture) => {
        if (days.length === 0) return true;

        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some((s) => days.includes(s.day));
      })
      .filter((lecture) => {
        if (times.length === 0) return true;

        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some((s) => s.range.some((time) => times.includes(time)));
      });
  }, [lectures, searchOptions]);

  const lastPage = useMemo(() => Math.ceil(filteredLectures.length / PAGE_SIZE), [filteredLectures.length]);
  const visibleLectures = useMemo(() => filteredLectures.slice(0, page * PAGE_SIZE), [filteredLectures, page]);
  const allMajors = useMemo(() => [...new Set(lectures.map((lecture) => lecture.major))], [lectures]);

  const changeSearchOption = useCallback((field: keyof SearchOption, value: SearchOption[typeof field]) => {
    setPage(1);
    setSearchOptions((prev) => ({ ...prev, [field]: value }));
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const handleQueryChange = useCallback(
    (value: string) => {
      changeSearchOption("query", value);
    },
    [changeSearchOption],
  );

  const handleCreditsChange = useCallback(
    (value: number | undefined) => {
      changeSearchOption("credits", value);
    },
    [changeSearchOption],
  );

  const handleGradesChange = useCallback(
    (value: number[]) => {
      changeSearchOption("grades", value);
    },
    [changeSearchOption],
  );

  const handleDaysChange = useCallback(
    (value: string[]) => {
      changeSearchOption("days", value);
    },
    [changeSearchOption],
  );

  const handleTimesChange = useCallback(
    (value: number[]) => {
      changeSearchOption("times", value);
    },
    [changeSearchOption],
  );

  const handleMajorsChange = useCallback(
    (value: string[]) => {
      changeSearchOption("majors", value);
    },
    [changeSearchOption],
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
    [searchInfo, setSchedulesMap, onClose],
  );

  useEffect(() => {
    LectureService.getInstance().getAllLectures().then(setLectures);
  }, []);

  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) return;

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
              <MemoizedQueryInput value={searchOptions.query} onChange={handleQueryChange} />
              <MemoizedCreditSelect value={searchOptions.credits} onChange={handleCreditsChange} />
            </HStack>

            <HStack spacing={4}>
              <MemoizedGradeSelect value={searchOptions.grades} onChange={handleGradesChange} />
              <MemoizedDaySelect value={searchOptions.days} onChange={handleDaysChange} />
            </HStack>

            <HStack spacing={4}>
              <MemoizedTimeSelect value={searchOptions.times} onChange={handleTimesChange} />
              <MemoizedMajorSelect allMajors={allMajors} value={searchOptions.majors} onChange={handleMajorsChange} />
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

              <MemoizedLectureTable
                visibleLectures={visibleLectures}
                onAddSchedule={addSchedule}
                loaderWrapperRef={loaderWrapperRef}
                loaderRef={loaderRef}
              />
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
