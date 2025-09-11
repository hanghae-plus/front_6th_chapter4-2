import { useState, useMemo } from "react";
import { Lecture } from "../types.ts";
import { parseSchedule } from "../utils/index.ts";
import { PAGE_SIZE } from "../constants/index.ts";
import { useAutoCallback } from "./useAutoCallback.tsx";

interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

export const useSearchLectures = (lectures: Lecture[]) => {
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

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

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = useMemo(
    () => filteredLectures.slice(0, page * PAGE_SIZE),
    [filteredLectures, page]
  );

  const changeSearchOption = (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => {
    setPage(1);
    setSearchOptions({ ...searchOptions, [field]: value });
  };

  const setSearchOptionsFromInfo = useAutoCallback(
    (searchInfo: { day?: string; time?: number } | null) => {
      setSearchOptions((prev) => ({
        ...prev,
        days: searchInfo?.day ? [searchInfo.day] : [],
        times: searchInfo?.time ? [searchInfo.time] : [],
      }));
      setPage(1);
    }
  );

  return {
    filteredLectures,
    visibleLectures,
    setPage,
    lastPage,
    searchOptions,
    changeSearchOption,
    setSearchOptionsFromInfo,
  };
};
