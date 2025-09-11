import { useState, useCallback, useMemo } from "react";
import { ProcessedLecture, SearchOption } from "../types";
import { useDebounce } from "./useDebounce";

export const useLectureFilter = (processedLectures: ProcessedLecture[]) => {
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const debouncedSearchOptions = useDebounce(searchOptions, 300);

  const filteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = debouncedSearchOptions;
    return processedLectures
      .filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase())
      )
      .filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
      .filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
      .filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
      .filter((lecture) => {
        if (days.length === 0) return true;
        return lecture.parsedSchedule.some((s) => days.includes(s.day));
      })
      .filter((lecture) => {
        if (times.length === 0) return true;
        return lecture.parsedSchedule.some((s) => s.range.some((t) => times.includes(t)));
      });
  }, [processedLectures, debouncedSearchOptions]);

  const changeSearchOption = useCallback((field: keyof SearchOption, value: any) => {
    setSearchOptions((prevOptions) => ({ ...prevOptions, [field]: value }));
  }, []);

  return { searchOptions, changeSearchOption, filteredLectures };
};
