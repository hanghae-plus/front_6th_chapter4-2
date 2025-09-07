import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import { Lecture } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import axios from "axios";
import { PAGE_SIZE } from "./constants.ts";
import SearchInput from "./components/SearchInput.tsx";
import FilterOptions from "./components/FilterOptions.tsx";
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
  query?: string,
  grades: number[],
  days: string[],
  times: number[],
  majors: string[],
  credits?: number,
}


const fetchMajors = () => axios.get<Lecture[]>('/schedules-majors.json');
const fetchLiberalArts = () => axios.get<Lecture[]>('/schedules-liberal-arts.json');

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const fetchAllLectures = async () => await Promise.all([
  (console.log('API Call 1', performance.now()), await fetchMajors()),
  (console.log('API Call 2', performance.now()), await fetchLiberalArts()),
  (console.log('API Call 3', performance.now()), await fetchMajors()),
  (console.log('API Call 4', performance.now()), await fetchLiberalArts()),
  (console.log('API Call 5', performance.now()), await fetchMajors()),
  (console.log('API Call 6', performance.now()), await fetchLiberalArts()),
]);

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
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

  // 검색 조건에 따라 강의 목록을 필터링하는 함수 (메모이제이션 적용)
  const getFilteredLectures = useMemo(() => {
    const { query = '', credits, grades, days, times, majors } = searchOptions;
    return lectures
      .filter(lecture =>
        lecture.title.toLowerCase().includes(query.toLowerCase()) ||
        lecture.id.toLowerCase().includes(query.toLowerCase())
      )
      .filter(lecture => grades.length === 0 || grades.includes(lecture.grade))
      .filter(lecture => majors.length === 0 || majors.includes(lecture.major))
      .filter(lecture => !credits || lecture.credits.startsWith(String(credits)))
      .filter(lecture => {
        if (days.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some(s => days.includes(s.day));
      })
      .filter(lecture => {
        if (times.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some(s => s.range.some(time => times.includes(time)));
      });
  }, [lectures, searchOptions]);

  // 필터링된 강의 목록
  const filteredLectures = getFilteredLectures;
  // 페이지네이션을 위한 총 페이지 수 계산
  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  // 현재 페이지까지의 강의 목록 (무한 스크롤용)
  const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);
  
  // 모든 전공 목록을 추출하는 함수 (메모이제이션 적용)
  const allMajors = useMemo(() => 
    [...new Set(lectures.map(lecture => lecture.major))], 
    [lectures]
  );

  // 검색 옵션을 변경하는 함수 (메모이제이션 적용)
  const changeSearchOption = useCallback((field: keyof SearchOption, value: SearchOption[typeof field]) => {
    setPage(1); // 검색 조건 변경 시 첫 페이지로 이동
    setSearchOptions(prev => ({ ...prev, [field]: value })); // 검색 옵션 업데이트
    loaderWrapperRef.current?.scrollTo(0, 0); // 스크롤을 맨 위로 이동
  }, []);

  // 선택한 강의를 스케줄에 추가하는 함수 (메모이제이션 적용)
  const addSchedule = useCallback((lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    // 강의 스케줄을 파싱하여 스케줄 형태로 변환
    const schedules = parseSchedule(lecture.schedule).map(schedule => ({
      ...schedule,
      lecture
    }));

    // 스케줄 맵에 새로운 스케줄 추가
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules]
    }));

    onClose(); // 다이얼로그 닫기
  }, [searchInfo, setSchedulesMap, onClose]);

  useEffect(() => {
    const start = performance.now();
    console.log('API 호출 시작: ', start)
    fetchAllLectures().then(results => {
      const end = performance.now();
      console.log('모든 API 호출 완료 ', end)
      console.log('API 호출에 걸린 시간(ms): ', end - start)
      setLectures(results.flatMap(result => result.data));
    })
  }, []);

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
              <SearchInput 
                value={searchOptions.query || ''}
                onChange={(value) => changeSearchOption('query', value)}
              />
              <FormControl>
                <FormLabel>학점</FormLabel>
                <Select
                  value={searchOptions.credits}
                  onChange={(e) => changeSearchOption('credits', e.target.value)}
                >
                  <option value="">전체</option>
                  <option value="1">1학점</option>
                  <option value="2">2학점</option>
                  <option value="3">3학점</option>
                </Select>
              </FormControl>
            </HStack>

            <FilterOptions 
              searchOptions={searchOptions}
              allMajors={allMajors}
              onChange={changeSearchOption}
            />

            <Text align="right">
              검색결과: {filteredLectures.length}개
            </Text>
            <Box ref={loaderWrapperRef}>
              <LectureTable 
                visibleLectures={visibleLectures}
                filteredLectures={filteredLectures}
                onAddSchedule={addSchedule}
              />
              <Box ref={loaderRef} h="20px"/>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;