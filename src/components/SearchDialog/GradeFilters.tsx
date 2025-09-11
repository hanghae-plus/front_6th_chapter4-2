import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { memo } from "react";

interface GradeFiltersProps {
  grades: number[];
  onChange: (grades: number[]) => void;
}

const GradeFilters = memo(({ grades, onChange }: GradeFiltersProps) => {
  console.log("GradeFilters 리렌더링");

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
});

GradeFilters.displayName = "GradeFilters";

export default GradeFilters;
