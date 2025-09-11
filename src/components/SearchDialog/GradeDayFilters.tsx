import { memo } from "react";
import { FormControl, FormLabel, CheckboxGroup, Checkbox, HStack } from "@chakra-ui/react";
import { DAY_LABELS } from "../../constants";

interface GradeDayFiltersProps {
  grades: number[];
  days: string[];
  onChange: (field: string, value: number[] | string[]) => void;
}

const GradeDayFilters = memo(
  ({ grades, days, onChange }: GradeDayFiltersProps) => {
    return (
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>학년</FormLabel>
          <CheckboxGroup value={grades} onChange={(value) => onChange("grades", value.map(Number))}>
            <HStack spacing={4}>
              {[1, 2, 3, 4].map((grade) => (
                <Checkbox key={grade} value={grade}>
                  {grade}학년
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
        </FormControl>

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
      </HStack>
    );
  },
  (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  }
);

GradeDayFilters.displayName = "GradeDayFilters";

export default GradeDayFilters;
