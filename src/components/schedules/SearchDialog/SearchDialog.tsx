import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Text } from '@chakra-ui/react/typography';
import { FormControl, FormLabel } from '@chakra-ui/react/form-control';
import { HStack, VStack } from '@chakra-ui/react/stack';
import {
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@chakra-ui/react/modal';
import { Input } from '@chakra-ui/react/input';
import { Box } from '@chakra-ui/react/box';
import { Lecture, SearchOption } from '../../../types.ts';
import { parseSchedule } from '../../../utils/utils.ts';
import axios from 'axios';

import { createCachedApi } from '../../../lib/createCachedApi.ts';

import { Table, Tbody, Thead } from '@chakra-ui/react/table';

import { useAutoCallback } from '../../../hooks/useAutoCallback.ts';
import { PAGE_SIZE } from '../../../constants/constants.ts';
import {
  CheckMajor,
  CheckTime,
  LectureItem,
  GradeSelect,
  CheckDays,
} from './components';
import CheckGrade from './components/CheckGrade.tsx';
import { store } from '../../../store/schedules.store.ts';
import { searchInfoStore } from '../../../store/searchInfo.store.ts';

const fetchMajors = createCachedApi(() =>
  axios.get<Lecture[]>('/schedules-majors.json')
);
const fetchLiberalArts = createCachedApi(() =>
  axios.get<Lecture[]>('/schedules-liberal-arts.json')
);

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const fetchAllLectures = async () => {
  const [majorsResponse, liberalArtsResponse] = await Promise.all([
    fetchMajors(),
    fetchLiberalArts(),
  ]);

  return [...majorsResponse.data, ...liberalArtsResponse.data];
};

const LectureTableHead = memo(() => {
  return (
    <Thead>
      <tr>
        <th style={{ width: '100px' }}>과목코드</th>
        <th style={{ width: '50px' }}>학년</th>
        <th style={{ width: '200px' }}>과목명</th>
        <th style={{ width: '50px' }}>학점</th>
        <th style={{ width: '150px' }}>전공</th>
        <th style={{ width: '150px' }}>시간</th>
        <th style={{ width: '80px' }}></th>
      </tr>
    </Thead>
  );
});
const SearchDialogHeader = () => {
  return (
    <>
      <ModalHeader>수업 검색</ModalHeader>
      <ModalCloseButton />
    </>
  );
};

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = memo(() => {
  const searchInfo = useSyncExternalStore(
    callback => searchInfoStore.subscribeSearch(callback),
    () => searchInfoStore.getSearchInfo(),
    () => null
  );
  const handleSearchClose = () => searchInfoStore.setSearchInfo(null);

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

  const filteredLectures = useMemo(() => {
    const { query = '', credits, grades, days, times, majors } = searchOptions;
    return lectures
      .filter(
        lecture =>
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase())
      )
      .filter(lecture => grades.length === 0 || grades.includes(lecture.grade))
      .filter(lecture => majors.length === 0 || majors.includes(lecture.major))
      .filter(
        lecture => !credits || lecture.credits.startsWith(String(credits))
      )
      .filter(lecture => {
        if (days.length === 0) {
          return true;
        }
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule)
          : [];
        return schedules.some(s => days.includes(s.day));
      })
      .filter(lecture => {
        if (times.length === 0) {
          return true;
        }
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule)
          : [];
        return schedules.some(s => s.range.some(time => times.includes(time)));
      });
  }, [lectures, searchOptions]);

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);
  const allMajors = useMemo(
    () => [...new Set(lectures.map(lecture => lecture.major))],
    [lectures]
  );

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      // setPage(1);
      setSearchOptions(prev => ({ ...prev, [field]: value })); // 함수형 업데이트!
      loaderWrapperRef.current?.scrollTo(0, 0);
    },
    []
  );

  const addSchedule = useAutoCallback((lecture: Lecture) => {
    if (!searchInfo) return;
    console.log('추가');
    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map(schedule => ({
      ...schedule,
      lecture,
    }));
    store.addSchedule(tableId, schedules);
    handleSearchClose();
  });

  useEffect(() => {
    const start = performance.now();
    console.log('API 호출 시작: ', start);
    fetchAllLectures().then(results => {
      const end = performance.now();
      console.log('모든 API 호출 완료 ', end);
      console.log('API 호출에 걸린 시간(ms): ', end - start);
      const preprocessedLectures = results.map(lecture => ({
        ...lecture,
        major: lecture.major?.replace(/<[^>]*>/g, '').trim() || '',
        schedule: lecture.schedule?.replace(/<[^>]*>/g, '').trim() || '',
      }));
      setLectures(preprocessedLectures);
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
    setSearchOptions(prev => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    setPage(1);
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={handleSearchClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <SearchDialogHeader />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>검색어</FormLabel>
                <Input
                  placeholder="과목명 또는 과목코드"
                  value={searchOptions.query}
                  onChange={e => changeSearchOption('query', e.target.value)}
                />
              </FormControl>

              <GradeSelect
                selectedCredits={searchOptions.credits}
                changeSearchOption={changeSearchOption}
              />
            </HStack>

            <HStack spacing={4}>
              <CheckGrade
                selectedGrades={searchOptions.grades}
                onChange={changeSearchOption}
              />
              <CheckDays
                selectedDays={searchOptions.days}
                onChange={changeSearchOption}
              />
            </HStack>

            <HStack spacing={4}>
              <CheckTime
                selectedTimes={searchOptions.times}
                changeSearchOption={changeSearchOption}
              />

              <CheckMajor
                allMajors={allMajors}
                selectedMajors={searchOptions.majors}
                changeSearchOption={changeSearchOption}
              />
            </HStack>
            <Text align="right">검색결과: {filteredLectures.length}개</Text>
            <Box>
              <Table
                sx={{
                  '& th': {
                    fontSize: 14,
                  },
                }}
              >
                <LectureTableHead />
              </Table>

              <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
                <Table
                  size="sm"
                  variant="striped"
                  sx={{
                    '& td': {
                      fontSize: 12,
                      padding: 4,
                    },
                    button: {
                      bgColor: '#38A169',
                      paddingInline: '0.75rem',
                      paddingBlock: '0.4rem',
                      borderRadius: 4,
                      color: 'white',
                    },
                  }}
                >
                  <Tbody>
                    {visibleLectures.map((lecture, index) => (
                      <LectureItem
                        key={`${lecture.id}-${index}`}
                        {...lecture}
                        onAddSchedule={addSchedule}
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
});

export default SearchDialog;
