import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { memo } from "react";
import { SearchOption } from "../../../types";

interface GradeFilterProps {
  grades: number[];
  onChange: (field: keyof SearchOption, value: number[]) => void;
}

const GradeFilter = memo(
  ({ grades, onChange }: GradeFilterProps) => {
    console.log("GradeFilter 리렌더링");

    return (
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup value={grades} onChange={(value) => onChange("grades", value.map(Number))}>
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
    // grades 배열이 동일한지 확인 (참조 동일성 우선 체크)
    if (prev.grades === next.grades && prev.onChange === next.onChange) {
      return true;
    }

    // 길이가 다르면 다름
    if (prev.grades.length !== next.grades.length) {
      return false;
    }

    // 각 요소 비교
    return prev.grades.every((grade, index) => grade === next.grades[index]) && prev.onChange === next.onChange;
  }
);

GradeFilter.displayName = "GradeFilter";

export default GradeFilter;
