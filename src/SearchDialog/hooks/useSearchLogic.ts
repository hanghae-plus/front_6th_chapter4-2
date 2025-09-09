import { useCallback, useMemo, useState } from "react";
import { Lecture } from "../../types.ts";
import { parseSchedule } from "../../utils.ts";
import { SearchOption } from "../types.ts";

/**
 * 검색 로직을 관리하는 커스텀 훅
 * 검색 옵션 및 필터링 로직을 담당합니다.
 */
export const useSearchLogic = (lectures: Lecture[]) => {
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  // 검색 옵션에 따라 강의 목록을 필터링하는 함수
  const filteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;
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

  // 전공 목록 계산
  const allMajors = useMemo(() => {
    return [...new Set(lectures.map((lecture) => lecture.major))];
  }, [lectures]);

  // 검색 옵션 변경 함수 - useCallback으로 최적화
  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    searchOptions,
    setSearchOptions,
    filteredLectures,
    allMajors,
    changeSearchOption,
  };
};
