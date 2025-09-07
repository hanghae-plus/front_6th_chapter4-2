import { useEffect, useState } from "react";
import { SearchInfo, SearchOptions } from "../types";
import { useAutoCallback } from "../../../hooks";

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

  const changeValue = <K extends keyof SearchOptions>(field: K, value: SearchOptions[K]) => {
    setValues({ ...values, [field]: value });
    onChange?.();
  };

  const makeChangeFunction =
    <K extends keyof SearchOptions>(field: K) =>
    (value: SearchOptions[K]) =>
      changeValue(field, value);

  const changeQuery = useAutoCallback(makeChangeFunction("query" as const));
  const changeGrades = useAutoCallback(makeChangeFunction("grades" as const));
  const changeDays = useAutoCallback(makeChangeFunction("days" as const));
  const changeTimes = useAutoCallback(makeChangeFunction("times" as const));
  const changeMajors = useAutoCallback(makeChangeFunction("majors" as const));
  const changeCredits = useAutoCallback(makeChangeFunction("credits" as const));

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    onChange?.();
  }, [searchInfo]);

  return {
    values,
    query: { value: values.query, change: changeQuery },
    grades: { value: values.grades, change: changeGrades },
    days: { value: values.days, change: changeDays },
    times: { value: values.times, change: changeTimes },
    majors: { value: values.majors, change: changeMajors },
    credits: { value: values.credits, change: changeCredits },
  };
};
