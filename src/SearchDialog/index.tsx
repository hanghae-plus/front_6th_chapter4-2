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
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useScheduleContext } from '../ScheduleContext.tsx';
import { Lecture } from '../types.ts';
import { createApiCache } from '../utils/apiCache.ts';
import { parseSchedule } from '../utils/utils.ts';
import LectureRow from './LectureRow.tsx';
import SearchInput from './SearchInput.tsx';
import SelectCredit from './SelectCredit.tsx';
import SelectDay from './SelectDay.tsx';
import SelectGrade from './SelectGrade.tsx';
import SelectMajor from './SelectMajor.tsx';
import SelectTime from './SelectTime.tsx';

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

// 캐시 인스턴스 생성
const apiCache = createApiCache();

// 캐시된 API 호출 함수들
const fetchMajors = () => apiCache('majors', () => axios.get<Lecture[]>('/schedules-majors.json'));

const fetchLiberalArts = () =>
  apiCache('liberal-arts', () => axios.get<Lecture[]>('/schedules-liberal-arts.json'));

// ! 최적화된 fetchAllLectures - Promise.all을 올바르게 사용하고 중복 호출 제거
// Promise.all로 병렬 실행, 중복 호출은 자동으로 캐시에서 처리됨
const fetchAllLectures = async () =>
  await Promise.all([
    fetchMajors(), // 새 Promise 생성
    fetchLiberalArts(), // 새 Promise 생성
    fetchMajors(), // 캐시된 Promise 재사용
    fetchLiberalArts(), // 캐시된 Promise 재사용
    fetchMajors(), // 캐시된 Promise 재사용
    fetchLiberalArts(), // 캐시된 Promise 재사용
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
  const [visibleLectures, setVisibleLectures] = useState<Lecture[]>([]);

  const filteredLectures = useMemo(() => {
    console.log('getFilteredLectures');
    const { query = '', credits, grades, days, times, majors } = searchOptions;

    return (
      lectures
        // 검색어 필터
        .filter(
          lecture =>
            lecture.title.toLowerCase().includes(query.toLowerCase()) ||
            lecture.id.toLowerCase().includes(query.toLowerCase())
        )
        // 학년 필터
        .filter(lecture => grades.length === 0 || grades.includes(lecture.grade))
        // 전공 필터
        .filter(lecture => majors.length === 0 || majors.includes(lecture.major))
        // 학점 필터
        .filter(lecture => !credits || lecture.credits.startsWith(String(credits)))
        // 요일 필터 - parseSchedule을 통해 시간표를 파싱하고 요일을 추출
        .filter(lecture => {
          if (days.length === 0) {
            return true;
          }
          const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
          return schedules.some(s => days.includes(s.day));
        })
        // 시간 필터 - parseSchedule을 통해 시간표를 파싱하고 시간을 추출
        .filter(lecture => {
          if (times.length === 0) {
            return true;
          }
          const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
          return schedules.some(s => s.range.some(time => times.includes(time)));
        })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectures, ...Object.values(searchOptions)]);

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions(prev => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    },
    []
  );

  const addSchedule = useCallback(
    (lecture: Lecture) => {
      if (!searchInfo) return;

      const { tableId } = searchInfo;
      const schedules = parseSchedule(lecture.schedule).map(schedule => ({
        ...schedule,
        lecture,
      }));

      setSchedulesMap(prev => ({
        ...prev,
        [tableId]: [...prev[tableId], ...schedules],
      }));

      onClose();
    },
    [searchInfo, setSchedulesMap, onClose]
  );

  useEffect(() => {
    setVisibleLectures(filteredLectures.slice(0, PAGE_SIZE));
    setPage(1);
  }, [filteredLectures]);

  useEffect(() => {
    const start = performance.now();

    console.log('API 호출 시작: ', start);

    fetchAllLectures().then(results => {
      const end = performance.now();

      console.log('모든 API 호출 완료 ', end);
      console.log('API 호출에 걸린 시간(ms): ', end - start);

      setLectures(results.flatMap(result => result.data));
    });
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
    if (page > 1) {
      const newItems = filteredLectures.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      setVisibleLectures(prev => [...prev, ...newItems]);
    }
  }, [page, filteredLectures]);

  useEffect(() => {
    setSearchOptions(prev => ({
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
              <SearchInput
                query={searchOptions.query || ''}
                changeSearchOption={changeSearchOption}
              />
              <SelectCredit
                credits={searchOptions.credits || 0}
                changeSearchOption={changeSearchOption}
              />
            </HStack>

            <HStack spacing={4}>
              <SelectGrade
                grades={searchOptions.grades || []}
                changeSearchOption={changeSearchOption}
              />
              <SelectDay days={searchOptions.days} changeSearchOption={changeSearchOption} />
            </HStack>

            <HStack spacing={4}>
              <SelectTime times={searchOptions.times} changeSearchOption={changeSearchOption} />
              <SelectMajor
                majors={searchOptions.majors}
                changeSearchOption={changeSearchOption}
                lectures={lectures}
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
                      <LectureRow
                        key={`${lecture.id}-${index}`}
                        lecture={lecture}
                        onAdd={addSchedule}
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
