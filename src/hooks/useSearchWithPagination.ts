import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { SEARCH_PAGE_SIZE } from '../constants';
import { Lecture } from '../types';
import { parseSchedule } from '../utils';

export interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

interface UseSearchWithPaginationProps {
  searchInfo: {
    day?: string;
    time?: number;
  } | null;
  lectures: Lecture[];
}

export const useSearchWithPagination = ({
  searchInfo,
  lectures,
}: UseSearchWithPaginationProps) => {
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: '',
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const loaderWrapperRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 필터링된 강의 목록 계산
  const filteredLectures = useMemo(() => {
    const { query = '', credits, grades, days, times, majors } = searchOptions;

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

  // 전체 전공 목록
  const allMajors = useMemo(() => {
    return [...new Set(lectures.map((lecture) => lecture.major))];
  }, [lectures]);

  const lastPage = Math.ceil(filteredLectures.length / SEARCH_PAGE_SIZE);

  const visibleLectures = useMemo(() => {
    return filteredLectures.slice(0, page * SEARCH_PAGE_SIZE);
  }, [filteredLectures, page]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const scrollToTop = useCallback(() => {
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      resetPage();
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      scrollToTop();
    },
    [resetPage, scrollToTop]
  );

  // searchInfo 변경시 검색 옵션 업데이트
  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    resetPage();
  }, [searchInfo, resetPage]);

  // filteredLectures 변경시 페이지 리셋
  useEffect(() => {
    setPage(1);
  }, [filteredLectures]);

  // Intersection Observer for infinite scroll
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

  return {
    searchOptions,
    changeSearchOption,
    filteredLectures,
    allMajors,
    visibleLectures,
    loaderWrapperRef,
    loaderRef,
  };
};