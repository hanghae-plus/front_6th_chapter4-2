import {
  CheckboxGroup,
  HStack,
  FormLabel,
  FormControl,
  Checkbox,
} from "@chakra-ui/react";
import { DAY_LABELS } from "../../constants";
import { memo } from "react";

interface Props {
  days: string[];
  onDaysChange: (days: string[]) => void;
}

function DayForm({ days, onDaysChange }: Props) {
  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup
        value={days}
        onChange={(value) => onDaysChange(value as string[])}
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

export default memo(DayForm);
