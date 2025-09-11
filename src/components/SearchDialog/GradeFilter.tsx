import { FormControl, FormLabel, CheckboxGroup, HStack, Checkbox } from "@chakra-ui/react";
import { GRADE_VALUES } from "../../constants";
import { SearchOption } from "../../types";

interface Props {
  selectedGrades: number[];
  onChange: (field: keyof SearchOption, value: any) => void;
}

export const GradeFilter = ({ selectedGrades, onChange }: Props) => {
  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup
        value={selectedGrades}
        onChange={(value) => onChange("grades", value.map(Number))}
      >
        <HStack spacing={4}>
          {GRADE_VALUES.map((grade) => (
            <Checkbox key={grade} value={grade}>
              {grade}학년
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
};
