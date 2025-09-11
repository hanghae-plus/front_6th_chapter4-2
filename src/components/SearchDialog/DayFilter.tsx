import { FormControl, FormLabel, CheckboxGroup, HStack, Checkbox } from "@chakra-ui/react";
import { DAY_LABELS } from "../../constants";
import { SearchOption } from "../../types";

interface Props {
  selectedDays: string[];
  onChange: (field: keyof SearchOption, value: any) => void;
}

export const DayFilter = ({ selectedDays, onChange }: Props) => {
  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup value={selectedDays} onChange={(value) => onChange("days", value as string[])}>
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
