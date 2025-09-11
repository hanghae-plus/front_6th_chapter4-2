import {
  Checkbox,
  CheckboxGroup,
  HStack,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { DAY_LABELS } from "../../../constants";
import { SearchOption } from "../../../types";
import { memo } from "react";

export const SearchDaysFilter = memo(
  ({
    searchOptions,
    changeSearchOption,
  }: {
    searchOptions: SearchOption["days"];
    changeSearchOption: (
      field: keyof SearchOption,
      value: SearchOption[typeof field]
    ) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>요일</FormLabel>
        <CheckboxGroup
          value={searchOptions}
          onChange={(value) => changeSearchOption("days", value as string[])}
        >
          <HStack spacing={4}>
            {DAY_LABELS.map((day) => (
              <Checkbox
                key={day}
                value={day}
              >
                {day}
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    );
  }
);
