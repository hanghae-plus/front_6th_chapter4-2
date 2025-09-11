import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { memo } from "react";
import { DAY_LABELS } from "../../constants";

interface DayFiltersProps {
  days: string[];
  onChange: (days: string[]) => void;
}

const DayFilters = memo(({ days, onChange }: DayFiltersProps) => {
  console.log("DayFilters 리렌더링");

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
});

DayFilters.displayName = "DayFilters";

export default DayFilters;
