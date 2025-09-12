import { memo } from "react";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { DAY_LABELS } from "../../../constants";

interface DayFilterProps {
  selected: string[];
  onChange: (v: string[]) => void;
}

export const DayFilter = memo(
  ({ selected, onChange }: DayFilterProps) => (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup value={selected} onChange={(value) => onChange(value as string[])}>
        <HStack spacing={4}>
          {DAY_LABELS.map((day) => (
            <Checkbox key={day} value={day}>
              {day}
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  ),
  (prevProps, nextProps) =>
    prevProps.selected === nextProps.selected &&
    prevProps.onChange === nextProps.onChange
);

DayFilter.displayName = "DayFilter";