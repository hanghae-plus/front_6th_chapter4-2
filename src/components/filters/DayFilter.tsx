import { memo } from "react";
import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { SearchOption } from "../../types";
import { DAY_LABELS } from "../../constants";

interface Props {
  days: string[];
  onChangeSearchOption: (field: keyof SearchOption, value: any) => void;
}

const DayFilter = ({ days, onChangeSearchOption }: Props) => {
  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup
        value={days}
        onChange={(value) => onChangeSearchOption("days", value as string[])}
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
};

export default memo(DayFilter, (prevProps, nextProps) => {
  return (
    prevProps.days.length === nextProps.days.length &&
    prevProps.days.every((day, index) => day === nextProps.days[index]) &&
    prevProps.onChangeSearchOption === nextProps.onChangeSearchOption
  );
});
