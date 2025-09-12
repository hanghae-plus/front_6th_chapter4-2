import { useState, useEffect, useRef, useMemo } from "react";
import { SEARCH_PAGE_SIZE } from "../constants";
import { Lecture } from "../types";
import { parseSchedule } from "../utils";
import { useAutoCallback } from "./useAutoCallback";

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
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const loaderWrapperRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 쿼리 필터링
  const queryFilteredLectures = useMemo(() => {
    const { query = "" } = searchOptions;
    if (!query) return lectures;
    
    return lectures.filter(
      (lecture) =>
        lecture.title.toLowerCase().includes(query.toLowerCase()) ||
        lecture.id.toLowerCase().includes(query.toLowerCase()),
    );
  }, [lectures, searchOptions.query]);

  // 학점 필터링
  const creditsFilteredLectures = useMemo(() => {
    const { credits } = searchOptions;
    if (!credits) return queryFilteredLectures;
    
    return queryFilteredLectures.filter(
      (lecture) => lecture.credits.startsWith(String(credits)),
    );
  }, [queryFilteredLectures, searchOptions.credits]);

  // 학년 필터링
  const gradesFilteredLectures = useMemo(() => {
    const { grades } = searchOptions;
    if (grades.length === 0) return creditsFilteredLectures;
    
    return creditsFilteredLectures.filter(
      (lecture) => grades.includes(lecture.grade),
    );
  }, [creditsFilteredLectures, searchOptions.grades]);

  // 전공 필터링
  const majorsFilteredLectures = useMemo(() => {
    const { majors } = searchOptions;
    if (majors.length === 0) return gradesFilteredLectures;
    
    return gradesFilteredLectures.filter(
      (lecture) => majors.includes(lecture.major),
    );
  }, [gradesFilteredLectures, searchOptions.majors]);

  // 요일 필터링
  const daysFilteredLectures = useMemo(() => {
    const { days } = searchOptions;
    if (days.length === 0) return majorsFilteredLectures;
    
    return majorsFilteredLectures.filter((lecture) => {
      const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
      return schedules.some((s) => days.includes(s.day));
    });
  }, [majorsFilteredLectures, searchOptions.days]);

  // 시간 필터링 (최종)
  const filteredLectures = useMemo(() => {
    const { times } = searchOptions;
    if (times.length === 0) return daysFilteredLectures;
    
    return daysFilteredLectures.filter((lecture) => {
      const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
      return schedules.some((s) => s.range.some((time) => times.includes(time)));
    });
  }, [daysFilteredLectures, searchOptions.times]);

  // 전체 전공 목록
  const allMajors = useMemo(() => {
    return [...new Set(lectures.map((lecture) => lecture.major))];
  }, [lectures]);

  const lastPage = useMemo(() => {
    return Math.ceil(filteredLectures.length / SEARCH_PAGE_SIZE);
  }, [filteredLectures]);

  const visibleLectures = useMemo(() => {
    return filteredLectures.slice(0, page * SEARCH_PAGE_SIZE);
  }, [filteredLectures, page]);


  const changeSearchOption = useAutoCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    }
  );

  const handleGradesChange = useAutoCallback((value: number[]) =>
    changeSearchOption("grades", value),
  );

  const handleDaysChange = useAutoCallback((value: string[]) => 
    changeSearchOption("days", value)
  );

  const handleTimesChange = useAutoCallback((value: number[]) =>
    changeSearchOption("times", value),
  );

  const handleMajorsChange = useAutoCallback((value: string[]) =>
    changeSearchOption("majors", value),
  );

  // searchInfo 변경시 검색 옵션 업데이트
  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
  }, [searchInfo]);

  // searchOptions 변경시 페이지 리셋
  const prevSearchOptionsRef = useRef<SearchOption | null>(null);
  useEffect(() => {
    const prev = prevSearchOptionsRef.current;
    const current = searchOptions;

    if (
      prev &&
      (prev.query !== current.query ||
        prev.credits !== current.credits ||
        prev.grades.length !== current.grades.length ||
        prev.days.length !== current.days.length ||
        prev.times.length !== current.times.length ||
        prev.majors.length !== current.majors.length ||
        !prev.grades.every((g) => current.grades.includes(g)) ||
        !prev.days.every((d) => current.days.includes(d)) ||
        !prev.times.every((t) => current.times.includes(t)) ||
        !prev.majors.every((m) => current.majors.includes(m)))
    ) {
      setPage(1);
    }

    prevSearchOptionsRef.current = { ...current };
  }, [searchOptions]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    // ref가 연결될 때까지 계속 체크
    const checkAndSetupObserver = () => {
      const $loader = loaderRef.current;
      const $loaderWrapper = loaderWrapperRef.current;

      if (
        !$loader ||
        !$loaderWrapper ||
        lastPage === 0 ||
        filteredLectures.length === 0
      ) {
        return null;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((currentPage) => {
              const currentLastPage = Math.ceil(
                filteredLectures.length / SEARCH_PAGE_SIZE,
              );
              if (currentPage < currentLastPage) {
                return Math.min(currentLastPage, currentPage + 1);
              }
              return currentPage;
            });
          }
        },
        {
          threshold: 0.1,
          root: $loaderWrapper,
          rootMargin: "10px",
        },
      );

      observer.observe($loader);
      return observer;
    };

    let observer: IntersectionObserver | null = null;
    let retryCount = 0;
    const maxRetries = 20; // 최대 2초까지 시도 (100ms * 20)

    const setupWithRetry = () => {
      if (filteredLectures.length === 0) {
        return;
      }

      observer = checkAndSetupObserver();

      if (!observer && retryCount < maxRetries) {
        retryCount++;
        setTimeout(setupWithRetry, 100);
      }
    };

    setupWithRetry();

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [lastPage, filteredLectures.length]); // page 의존성 제거로 매번 재생성 방지

  return {
    searchOptions,
    changeSearchOption,
    handleGradesChange,
    handleDaysChange, 
    handleTimesChange,
    handleMajorsChange,
    filteredLectures,
    allMajors,
    visibleLectures,
    loaderWrapperRef,
    loaderRef,
  };
};
