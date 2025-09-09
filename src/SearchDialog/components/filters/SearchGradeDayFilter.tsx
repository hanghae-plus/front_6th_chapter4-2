import React, { useCallback } from "react";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { DAY_LABELS } from "../../../constants.ts";
import { SearchOption } from "../../types.ts";

interface SearchGradeDayFilterProps {
  grades: number[];
  days: string[];
  onSearchOptionChange: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
}

const SearchGradeDayFilter = React.memo(
  ({ grades, days, onSearchOptionChange }: SearchGradeDayFilterProps) => {
    const handleGradesChange = useCallback(
      (value: string[]) => {
        onSearchOptionChange("grades", value.map(Number));
      },
      [onSearchOptionChange]
    );

    const handleDaysChange = useCallback(
      (value: string[]) => {
        onSearchOptionChange("days", value as string[]);
      },
      [onSearchOptionChange]
    );

    return (
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>학년</FormLabel>
          <CheckboxGroup value={grades} onChange={handleGradesChange}>
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
          <CheckboxGroup value={days} onChange={handleDaysChange}>
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
  }
);

SearchGradeDayFilter.displayName = "SearchGradeDayFilter";

export default SearchGradeDayFilter;
