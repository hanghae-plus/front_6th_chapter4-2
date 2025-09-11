import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { memo } from "react";
import { DAY_LABELS } from "../../../constants/constants";

interface DayFilterProps {
  days: string[];
  onChange: (days: string[]) => void;
}

const DayFilter = memo(
  ({ days, onChange }: DayFilterProps) => {
    console.log("DayFilter 리렌더링");

    return (
      <FormControl>
        <FormLabel>요일</FormLabel>
        <CheckboxGroup value={days} onChange={(value) => onChange(value as string[])}>
          <HStack spacing={4}>
            {DAY_LABELS.map((day) => (
              <Checkbox key={day} value={day}>
                {day}
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    );
  },
  (prev, next) => {
    return (
      prev.days.length === next.days.length &&
      prev.days.every((day, index) => day === next.days[index]) &&
      prev.onChange === next.onChange
    );
  }
);

DayFilter.displayName = "DayFilter";

export default DayFilter;
