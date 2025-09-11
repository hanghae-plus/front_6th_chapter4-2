import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Lecture } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import axios from "axios";
import { DAY_LABELS } from "./constants.ts";
import { memoizedFetch } from "./cache.ts";
import { SearchItem } from "./components/search/SearchItem.tsx";
import { FormInput } from "./components/common/FormInput.tsx";
import { FormSelect } from "./components/common/FormSelect.tsx";
import { FormCheckbox } from "./components/common/FormCheckbox.tsx";
import { SearchMajorsInput } from "./components/search/SearchMajorsInput.tsx";
import { SearchTimeInput } from "./components/search/SearchTimesInput.tsx";
import { useSearchDialog } from "./components/hooks/useSearchDialog.ts";
import { useScheduleActionContext } from "./ScheduleContext.tsx";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const PAGE_SIZE = 100;

const CREDITS_OPTIONS = [
  { label: "전체", value: "" },
  { label: "1학점", value: "1" },
  { label: "2학점", value: "2" },
  { label: "3학점", value: "3" },
];

const GRADE_OPTIONS = [
  { label: "전체", value: "" },
  { label: "1학년", value: "1" },
  { label: "2학년", value: "2" },
  { label: "3학년", value: "3" },
];

const DAY_OPTIONS = DAY_LABELS.map((day) => ({
  label: day,
  value: day,
}));

const fetchMajors = () => axios.get<Lecture[]>("/schedules-majors.json");
const fetchLiberalArts = () =>
  axios.get<Lecture[]>("/schedules-liberal-arts.json");

const fetchAllLectures = async () =>
  await Promise.all([
    (console.log("API Call 1", performance.now()),
    memoizedFetch("majors", fetchMajors)),
    (console.log("API Call 2", performance.now()),
    memoizedFetch("liberalArts", fetchLiberalArts)),
    (console.log("API Call 3", performance.now()),
    memoizedFetch("majors", fetchMajors)),
    (console.log("API Call 4", performance.now()),
    memoizedFetch("liberalArts", fetchLiberalArts)),
    (console.log("API Call 5", performance.now()),
    memoizedFetch("majors", fetchMajors)),
    (console.log("API Call 6", performance.now()),
    memoizedFetch("liberalArts", fetchLiberalArts)),
  ]);

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = memo(({ searchInfo, onClose }: Props) => {
  const { updateTableSchedules } = useScheduleActionContext();

  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);

  const {
    page,
    setPage,
    loaderWrapperRef,
    searchOptions,
    setSearchOptions,
    handlers,
  } = useSearchDialog();

  const filteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;

    return lectures.filter((lecture) => {
      if (query) {
        const lowerQuery = query.toLowerCase();
        if (
          !(
            lecture.title.toLowerCase().includes(lowerQuery) ||
            lecture.id.toLowerCase().includes(lowerQuery)
          )
        )
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
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule)
          : [];
        if (
          days.length > 0 &&
          !schedules.some((schedule) => days.includes(schedule.day))
        )
          return false;

        if (
          times.length > 0 &&
          !schedules.some((schedule) =>
            schedule.range.some((time) => times.includes(time))
          )
        )
          return false;
      }

      return true;
    });
  }, [lectures, searchOptions]);

  const { lastPage, visibleLectures } = useMemo(
    () => ({
      lastPage: Math.ceil(filteredLectures.length / PAGE_SIZE),
      visibleLectures: filteredLectures.slice(0, page * PAGE_SIZE),
    }),
    [filteredLectures, page]
  );

  const allMajors = useMemo(
    () =>
      lectures.length > 0
        ? [...new Set(lectures.map((lecture) => lecture.major))]
        : [],
    [lectures]
  );

  const addSchedule = useCallback(
    (lecture: Lecture) => {
      if (!searchInfo) return;

      const { tableId } = searchInfo;

      const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
        ...schedule,
        lecture,
      }));

      updateTableSchedules(tableId, (prev) => [...prev, ...schedules]);

      onClose();
    },
    [onClose, searchInfo, updateTableSchedules]
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
  }, [lastPage, loaderWrapperRef, setPage]);

  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    setPage(1);
  }, [searchInfo, setPage, setSearchOptions]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <FormInput
                label="검색어"
                placeholder="과목명 또는 과목코드"
                value={searchOptions.query}
                onChange={handlers.handleQueryChange}
              />

              <FormSelect
                label="학점"
                value={searchOptions.credits}
                onChange={handlers.handleCreditsChange}
                options={CREDITS_OPTIONS}
              />
            </HStack>

            <HStack spacing={4}>
              <FormCheckbox
                label="학년"
                value={searchOptions.grades}
                onChange={handlers.handleGradesChange}
                options={GRADE_OPTIONS}
              />
              <FormCheckbox
                label="요일"
                value={searchOptions.days}
                onChange={handlers.handleDaysChange}
                options={DAY_OPTIONS}
              />
            </HStack>
            <HStack spacing={4}>
              <SearchTimeInput
                selectedTimes={searchOptions.times}
                onChangeCheckbox={handlers.handleTimesChange}
                onCloseTag={handlers.handleTimeTagClose}
              />
              <SearchMajorsInput
                selectedMajors={searchOptions.majors}
                onChangeCheckbox={handlers.handleMajorsChange}
                onCloseTag={handlers.handleMajorTagClose}
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
});

export default SearchDialog;
