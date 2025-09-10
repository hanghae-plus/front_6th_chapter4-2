import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useDebounce } from "./hooks/useDebounce.ts";
import { useIntersectionObserver } from "./hooks/useIntersectionObserver.ts";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { useScheduleContext } from "../ScheduleContext.tsx";
import { Lecture, SearchOption } from "./types.ts";
import { parseSchedule } from "../utils.ts";
import axios from "axios";
import { cacheManager } from "../cache";
import SearchFilter from "./components/SearchFilters.tsx";
import SearchResultTable from "./components/SearchResultTable.tsx";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
  addLecture: (lecture: Lecture) => void;
}

const PAGE_SIZE = 100;

const cachedFetchMajors = cacheManager.createCachedFunction(
  () => axios.get<Lecture[]>("/schedules-majors.json"),
  {
    ttl: 5000,
    prefix: "schedules-majors",
  }
);

const cachedFetchLiberalArts = cacheManager.createCachedFunction(
  () => axios.get<Lecture[]>("/schedules-liberal-arts.json"),
  {
    ttl: 5000,
    prefix: "schedules-liberal-arts",
  }
);

const fetchAllLectures = async () => {
  const start = performance.now();
  console.log("API 호출 시작: ", start);

  const [majorsResult, liberalArtsResult] = await Promise.all([
    cachedFetchMajors(),
    cachedFetchLiberalArts(),
  ]);

  const end = performance.now();
  console.log("API 호출 완료: ", end);
  console.log("API 호출 소요시간(ms): ", end - start);

  return [...majorsResult.data, ...liberalArtsResult.data];
};

const SearchDialog = ({ searchInfo, onClose, addLecture }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  type SearchOptionAction =
    | { type: "query"; value: string }
    | { type: "grades"; value: number[] }
    | { type: "days"; value: string[] }
    | { type: "times"; value: number[] }
    | { type: "majors"; value: string[] }
    | { type: "credits"; value: number | undefined };

  const searchOptionsReducer = (
    state: SearchOption,
    action: SearchOptionAction
  ): SearchOption => {
    return {
      ...state,
      [action.type]: action.value,
    };
  };

  const [searchOptions, dispatch] = useReducer(searchOptionsReducer, {
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const debouncedSearchOptions = useDebounce(searchOptions, 300);

  const filteredLectures = useMemo(() => {
    const start = performance.now();
    console.log("[새로운 버전] 필터링 시작");
    const {
      query = "",
      credits,
      grades,
      days,
      times,
      majors,
    } = debouncedSearchOptions;
    const lowercaseQuery = query.toLowerCase();

    const result = lectures.filter((lecture) => {
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

      if (days.length > 0 || times.length > 0) {
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule)
          : [];

        if (days.length > 0 && !schedules.some((s) => days.includes(s.day))) {
          return false;
        }

        if (
          times.length > 0 &&
          !schedules.some((s) => s.range.some((time) => times.includes(time)))
        ) {
          return false;
        }
      }

      return true;
    });

    const end = performance.now();
    console.log(
      `[새로운 버전] 필터링 완료: ${(end - start).toFixed(2)}ms, 결과: ${
        lectures.length
      } -> ${result.length}개`
    );
    return result;
  }, [lectures, debouncedSearchOptions]);

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

  const handleSearchOptionChange = useCallback(
    <T extends keyof SearchOption>(field: T, value: SearchOption[T]) => {
      const start = performance.now();
      setPage(1);
      dispatch({ type: field, value } as SearchOptionAction);
      loaderWrapperRef.current?.scrollTo(0, 0);
      const end = performance.now();
      console.log(
        `[새로운 버전] 검색 옵션 변경 (${field}) 소요시간: ${(
          end - start
        ).toFixed(2)}ms`
      );
    },
    []
  );

  const handleAddSchedule = useCallback(
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

      addLecture(lecture);
      onClose();
    },
    [searchInfo, setSchedulesMap, onClose, addLecture]
  );

  useEffect(() => {
    fetchAllLectures().then((results) => {
      setLectures(results);
    });
  }, []);

  const handleIntersect = useCallback(() => {
    setPage((prevPage) => Math.min(lastPage, prevPage + 1));
  }, [lastPage]);

  useIntersectionObserver({
    onIntersect: handleIntersect,
    targetRef: loaderRef,
    rootRef: loaderWrapperRef,
    enabled: page < lastPage,
  });

  useEffect(() => {
    dispatch({ type: "days", value: searchInfo?.day ? [searchInfo.day] : [] });
    dispatch({
      type: "times",
      value: searchInfo?.time ? [searchInfo.time] : [],
    });
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
            <SearchFilter
              searchOptions={searchOptions}
              allMajors={allMajors}
              onSearchOptionChange={handleSearchOptionChange}
            />
            <SearchResultTable
              visibleLectures={visibleLectures}
              totalCount={filteredLectures.length}
              onAddSchedule={handleAddSchedule}
              loaderWrapperRef={loaderWrapperRef}
              loaderRef={loaderRef}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
