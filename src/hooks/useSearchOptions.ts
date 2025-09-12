import { useState, useMemo } from 'react';
import { SearchOption } from '../types';
import { Lecture } from '../types';
import { parseSchedule } from '../utils.ts';
import { PAGE_SIZE } from '../constants.ts';

export function useSearchOptions(lectures: Lecture[]) {
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: '',
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const filteredLectures = useMemo(() => {
    const { query = '', credits, grades, days, times, majors } = searchOptions;

    const hasGradesFilter = grades.length > 0;
    const hasMajorsFilter = majors.length > 0;
    const hasCreditsFilter = Boolean(credits);
    const hasDaysFilter = days.length > 0;
    const hasTimesFilter = times.length > 0;
    const hasQueryFilter = query.trim().length > 0;

    const normalizedQuery = hasQueryFilter ? query.toLowerCase() : '';

    return lectures.filter((lecture) => {
      // 1. 검색어 필터링
      if (hasQueryFilter) {
        const titleMatch = lecture.title.toLowerCase().includes(normalizedQuery);
        const idMatch = lecture.id.toLowerCase().includes(normalizedQuery);
        if (!titleMatch && !idMatch) return false;
      }

      // 2. 학년 필터링
      if (hasGradesFilter && !grades.includes(lecture.grade)) return false;

      // 3. 전공 필터링
      if (hasMajorsFilter && !majors.includes(lecture.major)) return false;

      // 4. 학점 필터링
      if (hasCreditsFilter && !lecture.credits.startsWith(String(credits))) return false;

      // 5. 요일/시간 필터링
      if (hasDaysFilter || hasTimesFilter) {
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];

        // 요일 체크
        if (hasDaysFilter && !schedules.some((s) => days.includes(s.day))) return false;

        // 시간 체크
        if (hasTimesFilter && !schedules.some((s) => s.range.some((time) => times.includes(time))))
          return false;
      }

      return true;
    });
  }, [lectures, searchOptions]);

  const lastPage = useMemo(
    () => Math.ceil(filteredLectures.length / PAGE_SIZE),
    [filteredLectures]
  );

  return {
    searchOptions,
    setSearchOptions,
    filteredLectures,
    lastPage,
  };
}
