import { memo } from "react";
import {
  FormControl,
  FormLabel,
  CheckboxGroup,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import { SearchOption } from "../SearchDialog";
import { DAY_LABELS } from "../constants";

interface DayCheckboxGroupProps {
  days: string[] | undefined;
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
}
export const DayCheckboxGroup = memo(
  ({ days, changeSearchOption }: DayCheckboxGroupProps) => {
    return (
      <FormControl>
        <FormLabel>요일</FormLabel>
        <CheckboxGroup
          value={days}
          onChange={(value) => changeSearchOption("days", value as string[])}
        >
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
