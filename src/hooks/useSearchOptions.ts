import { useState, useCallback, useEffect } from 'react';

export interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

interface UseSearchOptionsProps {
  searchInfo: {
    day?: string;
    time?: number;
  } | null;
  onPageReset: () => void;
  onScrollToTop: () => void;
}

export const useSearchOptions = ({
  searchInfo,
  onPageReset,
  onScrollToTop,
}: UseSearchOptionsProps) => {
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: '',
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      onPageReset();
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      onScrollToTop();
    },
    [onPageReset, onScrollToTop]
  );

  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    onPageReset();
  }, [searchInfo, onPageReset]);

  return { searchOptions, changeSearchOption };
};
