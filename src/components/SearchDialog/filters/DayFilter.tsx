import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { memo } from "react";
import { DAY_LABELS } from "../../../constants";
import { SearchOption } from "../../../types";

interface DayFilterProps {
  days: string[];
  onChange: (field: keyof SearchOption, value: string[]) => void;
}

const DayFilter = memo(
  ({ days, onChange }: DayFilterProps) => {
    console.log("DayFilter 리렌더링");

    return (
      <FormControl>
        <FormLabel>요일</FormLabel>
        <CheckboxGroup value={days} onChange={(value) => onChange("days", value as string[])}>
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
    // days 배열이 동일한지 확인 (참조 동일성 우선 체크)
    if (prev.days === next.days && prev.onChange === next.onChange) {
      return true;
    }

    // 길이가 다르면 다름
    if (prev.days.length !== next.days.length) {
      return false;
    }

    // 각 요소 비교
    return prev.days.every((day, index) => day === next.days[index]) && prev.onChange === next.onChange;
  }
);

DayFilter.displayName = "DayFilter";

export default DayFilter;
