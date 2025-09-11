import { memo } from "react";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { DAY_LABELS } from "../../constants.ts";

interface Props {
  days: string[];
  onChange: (values: string[]) => void;
}

const DaysFilter = memo(({ days, onChange }: Props) => {
  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup
        value={days}
        onChange={(value) => onChange(value as string[])}
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
});

DaysFilter.displayName = "DaysFilter";

export default DaysFilter;
