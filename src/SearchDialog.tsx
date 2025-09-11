import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
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
import { useScheduleContext } from "./ScheduleContext.tsx";
import { parseSchedule } from "./utils.ts";
import axios, { AxiosResponse } from "axios";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";
import { Lecture, Props, SearchOption } from "./types/type.ts";
import SearchBox from "./SearchBox.tsx";
import { PAGE_SIZE } from "./constants/index.ts";
import SearchForm from "./SearchForm.tsx";

const fetchMajors = () => axios.get<Lecture[]>("/schedules-majors.json");
const fetchLiberalArts = () => axios.get<Lecture[]>("/schedules-liberal-arts.json");

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const fetchAllLectures = async () => {
  let major: AxiosResponse<Lecture[]> | null = null;
  let liberalArts: AxiosResponse<Lecture[]> | null = null;

  const gethMajors = await fetchMajors();
  const getLiberalArts = await fetchLiberalArts();

  major = major ?? gethMajors;
  liberalArts = liberalArts ?? getLiberalArts;

  return Promise.all([
    (console.log("API Call 1", performance.now()), major),
    (console.log("API Call 2", performance.now()), liberalArts),
    (console.log("API Call 3", performance.now()), major),
    (console.log("API Call 4", performance.now()), liberalArts),
    (console.log("API Call 5", performance.now()), major),
    (console.log("API Call 6", performance.now()), liberalArts),
  ]);
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

  const getFilteredLectures = useAutoCallback((lectures: Lecture[], searchOptions: SearchOption) => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;
    return lectures
      .filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase()),
      )
      .filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
      .filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
      .filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
      .filter((lecture) => {
        if (days.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some((s) => days.includes(s.day));
      })
      .filter((lecture) => {
        if (times.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some((s) => s.range.some((time) => times.includes(time)));
      });
  });

  const filteredLectures = useMemo(() => getFilteredLectures(lectures, searchOptions), [lectures, searchOptions]);
  // const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = useMemo(() => {
    return filteredLectures.slice(0, page * PAGE_SIZE);
  }, [filteredLectures, page]);
  const allMajors = useMemo(() => [...new Set(lectures.map((lecture) => lecture.major))], [lectures]);

  const changeSearchOption = useAutoCallback(
    (
      field: keyof SearchOption,
      value: SearchOption[typeof field],
      loaderWrapperRef: React.RefObject<HTMLDivElement | null>,
    ) => {
      setPage(1);
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    },
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
    // 모달이 닫혀있으면 Observer 등록하지 않음
    if (!searchInfo) return;
    if (lectures.length === 0) return;

    let timeoutId: NodeJS.Timeout | null = null;
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      const $loader = loaderRef.current;
      const $loaderWrapper = loaderWrapperRef.current;

      if (!$loader || !$loaderWrapper) {
        timeoutId = setTimeout(setupObserver, 100);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => {
              const currentLastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
              return Math.min(currentLastPage, prevPage + 1);
            });
          }
        },
        { threshold: 0, root: $loaderWrapper },
      );

      observer.observe($loader);
    };

    setupObserver();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [searchInfo, lectures.length]);
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
            <SearchForm
              majors={searchOptions.majors}
              times={searchOptions.times}
              query={searchOptions.query}
              credits={searchOptions.credits}
              grades={searchOptions.grades}
              days={searchOptions.days}
              allMajors={allMajors}
              loaderWrapperRef={loaderWrapperRef}
              changeSearchOption={changeSearchOption}
            />
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

              <SearchBox
                loaderWrapperRef={loaderWrapperRef}
                loaderRef={loaderRef}
                visibleLectures={visibleLectures}
                addSchedule={addSchedule}
              />
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
