import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { memo, useCallback } from "react";

import { DAY_LABELS } from "../../../constants";

type DaySelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function DaySelect({ value, onChange }: DaySelectProps) {
  const handleChange = useCallback(
    (values: (string | number)[]) => {
      onChange(values as string[]);
    },
    [onChange],
  );

  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup value={value} onChange={handleChange}>
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

export const MemoizedDaySelect = memo(DaySelect);
