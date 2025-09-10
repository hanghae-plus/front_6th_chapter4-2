import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Box,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import { Lecture, SearchOption } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import axios from "axios";
import { DAY_LABELS } from "./constants.ts";
import { createCachedFetch } from "./createCachedFetch.ts";
import SearchFilter from "./components/SearchFilter";
import SearchResultTable from "./components/SearchResultTable";
import { SearchDialogContext } from "./components/SearchDialogContext";

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

const cachedFetch = createCachedFetch();
const fetchAllLectures = async () => {
  const promises = [
    cachedFetch("majors", fetchMajors, 1),
    cachedFetch("liberal-arts", fetchLiberalArts, 2),
    cachedFetch("majors", fetchMajors, 3),
    cachedFetch("liberal-arts", fetchLiberalArts, 4),
    cachedFetch("majors", fetchMajors, 5),
    cachedFetch("liberal-arts", fetchLiberalArts, 6),
  ];

  return await Promise.all(promises);
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

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    },
    []
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
    [searchInfo, setSchedulesMap, onClose]
  );

  const gradeCheckboxes = useMemo(
    () =>
      [1, 2, 3, 4].map((grade) => (
        <Checkbox key={grade} value={grade}>
          {grade}학년
        </Checkbox>
      )),
    []
  );

  const dayCheckboxes = useMemo(
    () =>
      DAY_LABELS.map((day) => (
        <Checkbox key={day} value={day}>
          {day}
        </Checkbox>
      )),
    []
  );

  const timeSlotCheckboxes = useMemo(
    () =>
      TIME_SLOTS.map(({ id, label }) => (
        <Box key={id}>
          <Checkbox key={id} size="sm" value={id}>
            {id}교시({label})
          </Checkbox>
        </Box>
      )),
    []
  );

  const contextValue = useMemo(
    () => ({
      changeSearchOption,
      addSchedule,
    }),
    [changeSearchOption, addSchedule]
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
    <SearchDialogContext.Provider value={contextValue}>
      <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxW="90vw" w="1000px">
          <ModalHeader>수업 검색</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <SearchFilter
                searchOptions={searchOptions}
                gradeCheckboxes={gradeCheckboxes}
                dayCheckboxes={dayCheckboxes}
                timeSlotCheckboxes={timeSlotCheckboxes}
                allMajors={allMajors}
                onChangeSearchOption={changeSearchOption}
              />
            </Box>

            <SearchResultTable
              visibleLectures={visibleLectures}
              filteredLectures={filteredLectures}
              loaderWrapperRef={loaderWrapperRef}
              loaderRef={loaderRef}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </SearchDialogContext.Provider>
  );
};

export default SearchDialog;
