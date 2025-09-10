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
  Text,
  VStack,
} from "@chakra-ui/react";
import { useScheduleContext } from "../../ScheduleContext.tsx";
import { Lecture, SearchOption } from "../../types.ts";
import { createApiCache, parseSchedule } from "../../utils.ts";
import axios from "axios";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import QueryInput from "./filter/QueryInput.tsx";
import CreditsSelect from "./filter/CreditsSelect.tsx";
import GradesCheckboxGroup from "./filter/GradesCheckboxGroup.tsx";
import DaysCheckboxGroup from "./filter/DaysCheckboxGroup.tsx";
import TimesCheckboxGroup from "./filter/TimesCheckboxGroup.tsx";
import MajorsCheckboxGroup from "./filter/MajorsCheckboxGroup.tsx";
import SearchItem from "./SearchItem.tsx";
import SearchTableHeader from "./SearchTableHeader.tsx";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const PAGE_SIZE = 100;

const apiCache = createApiCache();

const fetchMajors = () => apiCache('fetchMajors', () => axios.get<Lecture[]>('/schedules-majors.json'));
const fetchLiberalArts = () => apiCache('fetchLiberalArts', () => axios.get<Lecture[]>('/schedules-liberal-arts.json'));

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해 주세요.
const fetchAllLectures = async () => await Promise.all([
  (console.log('API Call 1', performance.now()), fetchMajors()),
  (console.log('API Call 2', performance.now()), fetchLiberalArts()),
  (console.log('API Call 3', performance.now()), fetchMajors()),
  (console.log('API Call 4', performance.now()), fetchLiberalArts()),
  (console.log('API Call 5', performance.now()), fetchMajors()),
  (console.log('API Call 6', performance.now()), fetchLiberalArts()),
]);

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해 주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: '',
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  // 필터링된 과목 목록 계산
  const filteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;
    const lowercaseQuery = query.toLowerCase();

    return lectures.filter((lecture) => {
      if (query) {
        if (
          !lecture.title.toLowerCase().includes(lowercaseQuery) &&
          !lecture.id.toLowerCase().includes(lowercaseQuery)
        ) {
          return false;
        }
      }

      if (grades.length > 0 && !grades.includes(lecture.grade)) return false;
      if (majors.length > 0 && !majors.includes(lecture.major)) return false;
      if (credits && !lecture.credits.startsWith(String(credits))) return false;

      if (days.length > 0 || times.length > 0) {
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];

        if (days.length > 0 && !schedules.some((s) => days.includes(s.day))) return false;
        if (times.length > 0 && !schedules.some((s) => s.range.some((time) => times.includes(time)))) return false;
      }

      return true;
    });
  }, [lectures, searchOptions]);

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);
  const allMajors = useMemo(() => [...new Set(lectures.map(lecture => lecture.major))], [lectures]);

  // 검색 옵션 변경
  const changeSearchOption = useAutoCallback((field: keyof SearchOption, value: SearchOption[typeof field]) => {
    setPage(1);
    setSearchOptions(({ ...searchOptions, [field]: value }));
    loaderWrapperRef.current?.scrollTo(0, 0);
  });

  // 시간표 추가
  const addSchedule = useAutoCallback((lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map(schedule => ({
      ...schedule,
      lecture
    }));

    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules]
    }));

    onClose();
  });

  // 모든 과목 데이터 로드
  useEffect(() => {
    fetchAllLectures().then(results => {
      setLectures(results.flatMap(result => result.data));
    })
  }, []);

  // 무한 스크롤 처리
  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => Math.min(lastPage, prevPage + 1));
        }
      },
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  // 검색 옵션 변경 시 페이지 초기화
  useEffect(() => {
    setSearchOptions(prev => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }))
    setPage(1);
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay/>
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              {/* 검색어 입력 */}
              <QueryInput query={searchOptions.query} changeSearchOption={changeSearchOption}/>
              {/* 학점 선택 */}
              <CreditsSelect credits={searchOptions.credits} changeSearchOption={changeSearchOption}/>
            </HStack>

            <HStack spacing={4}>
              {/* 학년 선택 */}
              <GradesCheckboxGroup grades={searchOptions.grades} changeSearchOption={changeSearchOption}/>
              {/* 요일 선택 */}
              <DaysCheckboxGroup days={searchOptions.days} changeSearchOption={changeSearchOption}/>
            </HStack>
    
            <HStack spacing={4}>
              {/* 시간 선택 */}
              <TimesCheckboxGroup times={searchOptions.times} changeSearchOption={changeSearchOption}/>
              {/* 전공 선택 */}
              <MajorsCheckboxGroup majors={searchOptions.majors} changeSearchOption={changeSearchOption} allMajors={allMajors}/>
            </HStack>
            <Text align="right">
              검색결과: {filteredLectures.length}개
            </Text>
            <Box>
              <SearchTableHeader />

              <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <tbody>
                    {visibleLectures.map((lecture, index) => (
                      <SearchItem 
                        key={`${lecture.id}-${index}`} 
                        lecture={lecture} 
                        addSchedule={addSchedule}
                        isEven={index % 2 === 1}
                      />
                    ))}
                  </tbody>
                </table>
                <Box ref={loaderRef} h="20px"/>
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;