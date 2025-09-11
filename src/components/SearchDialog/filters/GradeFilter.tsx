import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { memo } from "react";

interface GradeFilterProps {
  grades: number[];
  onChange: (grades: number[]) => void;
}

const GradeFilter = memo(
  ({ grades, onChange }: GradeFilterProps) => {
    console.log("GradeFilter 리렌더링");

    return (
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup value={grades} onChange={(value) => onChange(value.map(Number))}>
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
  },
  (prev, next) => {
    return (
      prev.grades.length === next.grades.length &&
      prev.grades.every((grade, index) => grade === next.grades[index]) &&
      prev.onChange === next.onChange
    );
  }
);

GradeFilter.displayName = "GradeFilter";

export default GradeFilter;
