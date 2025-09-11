import { HStack } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import DayFilters from "./DayFilters";
import GradeFilters from "./GradeFilters";

interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

interface GradeDayFiltersProps {
  grades: number[];
  days: string[];
  onChange: (field: keyof SearchOption, value: SearchOption[keyof SearchOption]) => void;
}

const GradeDayFilters = memo(({ grades, days, onChange }: GradeDayFiltersProps) => {
  console.log("GradeDayFilters 리렌더링");

  // 각 필터별로 최적화된 onChange 함수 생성
  const handleGradeChange = useMemo(() => (newGrades: number[]) => onChange("grades", newGrades), [onChange]);

  const handleDayChange = useMemo(() => (newDays: string[]) => onChange("days", newDays), [onChange]);

  return (
    <HStack spacing={4}>
      <GradeFilters grades={grades} onChange={handleGradeChange} />
      <DayFilters days={days} onChange={handleDayChange} />
    </HStack>
  );
});

GradeDayFilters.displayName = "GradeDayFilters";

export default GradeDayFilters;
