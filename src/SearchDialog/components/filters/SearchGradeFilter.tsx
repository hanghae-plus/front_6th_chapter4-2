import React, { useCallback } from "react";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { SearchOption } from "../../types.ts";

interface SearchGradeFilterProps {
  grades: number[];
  onSearchOptionChange: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
}

const SearchGradeFilter = React.memo(
  ({ grades, onSearchOptionChange }: SearchGradeFilterProps) => {
    const handleGradesChange = useCallback(
      (value: string[]) => {
        onSearchOptionChange("grades", value.map(Number));
      },
      [onSearchOptionChange]
    );

    return (
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
    );
  }
);

SearchGradeFilter.displayName = "SearchGradeFilter";

export default SearchGradeFilter;
