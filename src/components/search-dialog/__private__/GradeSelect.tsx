import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { memo, useCallback } from "react";

type GradeSelectProps = {
  value: number[];
  onChange: (value: number[]) => void;
};

export function GradeSelect({ value, onChange }: GradeSelectProps) {
  const handleChange = useCallback(
    (values: (string | number)[]) => {
      onChange(values.map(Number));
    },
    [onChange],
  );

  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup value={value} onChange={handleChange}>
        <HStack spacing={4}>
          {[1, 2, 3, 4].map((grade) => (
            <Checkbox key={grade} value={grade}>
              {grade}학년
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
}

export const MemoizedGradeSelect = memo(GradeSelect);
