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

interface SearchDayFilterProps {
  days: string[];
  onSearchOptionChange: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
}

const SearchDayFilter = React.memo(
  ({ days, onSearchOptionChange }: SearchDayFilterProps) => {
    const handleDaysChange = useCallback(
      (value: string[]) => {
        onSearchOptionChange("days", value as string[]);
      },
      [onSearchOptionChange]
    );

    return (
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
    );
  }
);

SearchDayFilter.displayName = "SearchDayFilter";

export default SearchDayFilter;
