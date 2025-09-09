import { useCallback, useMemo, useRef, useState } from "react";

export interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

export const useSearchDialog = () => {
  const [page, setPage] = useState(1);
  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const resetPageAndScroll = useCallback(() => {
    setPage(1);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const updateSearchOptions = useCallback(
    (field: keyof SearchOption, value: unknown) => {
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      resetPageAndScroll();
    },
    [resetPageAndScroll]
  );

  const deleteSearchOption = useCallback(
    (field: keyof SearchOption, value: unknown) => {
      setSearchOptions((prev) => ({
        ...prev,
        [field]: (Array.isArray(prev[field]) ? prev[field] : []).filter(
          (v: string | number) => v !== value
        ),
      }));
      resetPageAndScroll();
    },
    [resetPageAndScroll]
  );

  const handlers = useMemo(
    () => ({
      handleQueryChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        updateSearchOptions("query", e.target.value),
      handleCreditsChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
        updateSearchOptions("credits", e.target.value),
      handleGradesChange: (value: Array<string | number>) =>
        updateSearchOptions("grades", value),
      handleDaysChange: (value: Array<string | number>) =>
        updateSearchOptions("days", value),
      handleTimesChange: (value: Array<string | number>) =>
        updateSearchOptions("times", value.map(Number)),
      handleMajorsChange: (value: Array<string | number>) =>
        updateSearchOptions("majors", value),
      handleTimeTagClose: (value: number | string) =>
        deleteSearchOption("times", value),
      handleMajorTagClose: (value: number | string) =>
        deleteSearchOption("majors", value),
    }),
    [updateSearchOptions, deleteSearchOption]
  );

  return {
    page,
    setPage,
    loaderWrapperRef,
    searchOptions,
    setSearchOptions,
    handlers,
  };
};
