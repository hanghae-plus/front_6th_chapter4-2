import { memo } from "react";
import {
  FormControl,
  FormLabel,
  CheckboxGroup,
  HStack,
} from "@chakra-ui/react";
import { SearchOption } from "../../types";

interface Props {
  days: string[];
  dayCheckboxes: React.ReactElement[];
  onChangeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[keyof SearchOption]
  ) => void;
}

const DayFilter = memo(
  ({ days, dayCheckboxes, onChangeSearchOption }: Props) => {
    return (
      <FormControl>
        <FormLabel>요일</FormLabel>
        <CheckboxGroup
          value={days}
          onChange={(value) => onChangeSearchOption("days", value as string[])}
        >
          <HStack spacing={4}>{dayCheckboxes}</HStack>
        </CheckboxGroup>
      </FormControl>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.days.length === nextProps.days.length &&
      prevProps.dayCheckboxes === nextProps.dayCheckboxes &&
      prevProps.onChangeSearchOption === nextProps.onChangeSearchOption
    );
  }
);

export default DayFilter;
