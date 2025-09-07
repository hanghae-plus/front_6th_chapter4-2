import { useEffect, useState } from "react";
import { SearchInfo, SearchOptions } from "../types";

interface Props {
  searchInfo: SearchInfo | null;
  onChange?: () => void;
}

export const useSearchOption = ({ searchInfo, onChange }: Props) => {
  const [values, setValues] = useState<SearchOptions>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const changeValue = (field: keyof SearchOptions, value: SearchOptions[typeof field]) => {
    setValues({ ...values, [field]: value });
    onChange?.();
  };

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    onChange?.();
  }, [searchInfo]);

  return [values, changeValue] as const;
};
