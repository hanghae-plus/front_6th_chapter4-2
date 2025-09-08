import { memo } from "react";
import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { SearchOption } from "../../types";

interface Props {
  grades: number[];
  onChangeSearchOption: (field: keyof SearchOption, value: any) => void;
}

const GradeFilter = ({ grades, onChangeSearchOption }: Props) => {
  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup value={grades} onChange={(value) => onChangeSearchOption("grades", value.map(Number))}>
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
};

export default memo(GradeFilter, (prevProps, nextProps) => {
  return (
    prevProps.grades.length === nextProps.grades.length &&
    prevProps.grades.every((grade, index) => grade === nextProps.grades[index]) &&
    prevProps.onChangeSearchOption === nextProps.onChangeSearchOption
  );
});
