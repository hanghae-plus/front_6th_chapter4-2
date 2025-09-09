import { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import { Lecture } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import axios from "axios";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";
import SearchFilters from "./components/SearchFilters.tsx";
import TimeFilter from "./components/TimeFilter.tsx";
import MajorFilter from "./components/MajorFilter.tsx";
import LectureTable from "./components/LectureTable.tsx";

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

const PAGE_SIZE = 100;

const fetchMajors = () => axios.get<Lecture[]>("/schedules-majors.json");
const fetchLiberalArts = () =>
  axios.get<Lecture[]>("/schedules-liberal-arts.json");

const fetchAllLectures = (() => {
  let cache: Promise<Lecture[]> | null = null;

  return async () => {
    if (cache) {
      return cache;
    }
    cache = Promise.all([fetchMajors(), fetchLiberalArts()]).then((results) => {
      console.log("API 호출 완료", performance.now());
      return results.flatMap((result) => result.data);
    });

    return cache;
  };
})();

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

  const filteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;
    const lowerQuery = query.toLowerCase();

    return lectures.filter((lecture) => {
      if (!lecture?.title || !lecture?.id) return false;

      // 검색어 필터
      const lowerTitle = lecture.title.toLowerCase();
      if (
        query &&
        !lowerTitle.includes(lowerQuery) &&
        !lecture.id.toLowerCase().includes(lowerQuery)
      ) {
        return false;
      }

      // 학년, 전공, 학점 필터
      if (grades.length > 0 && !grades.includes(lecture.grade)) return false;
      if (majors.length > 0 && !majors.includes(lecture.major)) return false;
      if (credits && !lecture.credits.startsWith(String(credits))) return false;

      const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];

      if (days.length > 0 && !schedules.some((s) => days.includes(s.day)))
        return false;
      if (
        times.length > 0 &&
        !schedules.some((s) => s.range.some((time) => times.includes(time)))
      )
        return false;

      return true;
    });
  }, [lectures, searchOptions]);

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = useMemo(() => {
    return filteredLectures.slice(0, page * PAGE_SIZE);
  }, [filteredLectures, page]);
  const allMajors = useMemo(() => {
    return [
      ...new Set(
        lectures
          .filter((lecture) => lecture && lecture.major)
          .map((lecture) => lecture.major)
      ),
    ];
  }, [lectures]);

  const changeSearchOption = useAutoCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
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

  // 이벤트 함수들..
  const handleQueryChange = useAutoCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      changeSearchOption("query", e.target.value)
  );

  const handleCreditsChange = useAutoCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      changeSearchOption("credits", e.target.value)
  );

  const handleGradesChange = useAutoCallback((value: (string | number)[]) =>
    changeSearchOption("grades", value.map(Number))
  );

  const handleDaysChange = useAutoCallback((value: (string | number)[]) =>
    changeSearchOption("days", value as string[])
  );

  const handleTimesChange = useAutoCallback((values: (string | number)[]) =>
    changeSearchOption("times", values.map(Number))
  );

  const handleMajorsChange = useAutoCallback((values: (string | number)[]) =>
    changeSearchOption("majors", values as string[])
  );

  const handleTimeRemove = useAutoCallback((timeToRemove: number) => {
    setSearchOptions((prev) => ({
      ...prev,
      times: prev.times.filter((v) => v !== timeToRemove),
    }));
    setPage(1);
    loaderWrapperRef.current?.scrollTo(0, 0);
  });

  const handleMajorRemove = useAutoCallback((majorToRemove: string) => {
    setSearchOptions((prev) => ({
      ...prev,
      majors: prev.majors.filter((v) => v !== majorToRemove),
    }));
    setPage(1);
    loaderWrapperRef.current?.scrollTo(0, 0);
  });

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <SearchFilters
              searchOptions={searchOptions}
              onQueryChange={handleQueryChange}
              onCreditsChange={handleCreditsChange}
              onGradesChange={handleGradesChange}
              onDaysChange={handleDaysChange}
            />

            <HStack spacing={4}>
              <TimeFilter
                times={searchOptions.times}
                onTimesChange={handleTimesChange}
                onTimeRemove={handleTimeRemove}
              />

              <MajorFilter
                majors={searchOptions.majors}
                allMajors={allMajors}
                onMajorsChange={handleMajorsChange}
                onMajorRemove={handleMajorRemove}
              />
            </HStack>

            <Text align="right">검색결과: {filteredLectures.length}개</Text>

            <LectureTable
              visibleLectures={visibleLectures}
              onAddSchedule={addSchedule}
              loaderWrapperRef={
                loaderWrapperRef as React.RefObject<HTMLDivElement>
              }
              loaderRef={loaderRef as React.RefObject<HTMLDivElement>}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
