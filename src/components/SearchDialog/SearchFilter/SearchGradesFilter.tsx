import { Checkbox } from "@chakra-ui/react";
import { SearchOption } from "../../../types";
import {
  CheckboxGroup,
  HStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { memo } from "react";

export const SearchGradesFilter = memo(
  ({
    searchOptions,
    onChange,
  }: {
    searchOptions: SearchOption["grades"];
    onChange: (value: SearchOption["grades"]) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup
          value={searchOptions}
          onChange={(value) => onChange(value.map(Number))}
        >
          <HStack spacing={4}>
            {[1, 2, 3, 4].map((grade) => (
              <Checkbox
                key={grade}
                value={grade}
              >
                {grade}학년
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    );
  }
);

SearchGradesFilter.displayName = "SearchGradesFilter";
