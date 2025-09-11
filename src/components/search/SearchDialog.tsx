import { useEffect, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useAutoCallback, useSearchOptions, useInfiniteScroll, useLectures } from '../../hooks';
import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import type { SearchOption } from '../../types.ts';
import { useSchedulesActions } from '../../contexts/ScheduleContext.tsx';
import { Lecture } from '../../types.ts';
import { parseSchedule } from '../../utils.ts';
import { SearchFilters } from './SearchFilters.tsx';
import { LectureTable } from './LectureTable.tsx';

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const createApiCache = () => {
  const cache = new Map<string, Promise<AxiosResponse<Lecture[]>>>();

  return (key: string, apiCall: () => Promise<AxiosResponse<Lecture[]>>) => {
    if (cache.has(key)) {
      console.log('Cache hit', key);
      return cache.get(key);
    }

    const promise = apiCall();
    cache.set(key, promise);

    return promise;
  };
};

const apiCache = createApiCache();

const fetchMajors = () => {
  return apiCache('majors', () => axios.get<Lecture[]>(`/schedules-majors.json`));
};

const fetchLiberalArts = () => {
  return apiCache('liberal-arts', () => axios.get<Lecture[]>(`/schedules-liberal-arts.json`));
};

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.

// 클로저 활용하여 캐싱해 재호출
const fetchAllLectures = async () =>
  await Promise.all([
    (console.log('API Call 1', performance.now()), fetchMajors()),
    (console.log('API Call 2', performance.now()), fetchLiberalArts()),
    (console.log('API Call 3', performance.now()), fetchMajors()),
    (console.log('API Call 4', performance.now()), fetchLiberalArts()),
    (console.log('API Call 5', performance.now()), fetchMajors()),
    (console.log('API Call 6', performance.now()), fetchLiberalArts()),
  ]);

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
export const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useSchedulesActions();
  const { lectures, setLectures, allMajors } = useLectures();
  const { searchOptions, setSearchOptions, filteredLectures } = useSearchOptions(lectures);

  const loaderWrapperRef = useRef<HTMLDivElement>(null);

  const { visibleItems: visibleLectures, loaderRef } = useInfiniteScroll({
    items: filteredLectures,
    root: loaderWrapperRef.current,
  });

  const changeSearchOption = useAutoCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setSearchOptions({ ...searchOptions, [field]: value });
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

  const handleRemoveTime = useAutoCallback((time: number) => {
    changeSearchOption(
      'times',
      searchOptions.times.filter((t) => t !== time)
    );
  });

  const handleQueryChange = useAutoCallback((query: string) => {
    changeSearchOption('query', query);
  });

  const handleCreditsChange = useAutoCallback((credits: number) => {
    changeSearchOption('credits', credits);
  });

  const handleGradesChange = useAutoCallback((grades: number[]) => {
    changeSearchOption('grades', grades);
  });

  const handleDaysChange = useAutoCallback((days: string[]) => {
    changeSearchOption('days', days);
  });

  const handleTimesChange = useAutoCallback((times: number[]) => {
    changeSearchOption('times', times);
  });

  const handleMajorsChange = useAutoCallback((majors: string[]) => {
    changeSearchOption('majors', majors);
  });

  const handleRemoveMajor = useAutoCallback((major: string) => {
    setSearchOptions((prev) => ({
      ...prev,
      majors: prev.majors.filter((m) => m !== major),
    }));
  });

  useEffect(() => {
    const start = performance.now();
    console.log('API 호출 시작: ', start);
    fetchAllLectures().then((results) => {
      const end = performance.now();
      console.log('모든 API 호출 완료 ', end);
      console.log('API 호출에 걸린 시간(ms): ', end - start);
      setLectures(results.flatMap((result) => result?.data ?? []));
    });
  }, []);

  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
  }, [searchInfo, setSearchOptions]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <SearchFilters>
              <HStack spacing={4}>
                <SearchFilters.Search value={searchOptions.query} onChange={handleQueryChange} />
                <SearchFilters.Credits
                  value={searchOptions.credits}
                  onChange={handleCreditsChange}
                />
              </HStack>

              <HStack spacing={4}>
                <SearchFilters.Grades value={searchOptions.grades} onChange={handleGradesChange} />
                <SearchFilters.Days value={searchOptions.days} onChange={handleDaysChange} />
              </HStack>

              <HStack spacing={4}>
                <SearchFilters.Times
                  value={searchOptions.times}
                  onChange={handleTimesChange}
                  onRemove={handleRemoveTime}
                />
                <SearchFilters.Majors
                  value={searchOptions.majors}
                  allMajors={allMajors}
                  onChange={handleMajorsChange}
                  onRemove={handleRemoveMajor}
                />
              </HStack>

              <SearchFilters.ResultCount count={visibleLectures.length} />
            </SearchFilters>

            <LectureTable
              lectures={visibleLectures}
              loaderWrapperRef={loaderWrapperRef}
              loaderRef={loaderRef}
              addSchedule={addSchedule}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
