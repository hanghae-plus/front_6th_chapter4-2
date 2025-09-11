import {
  FormControl,
  FormLabel,
  CheckboxGroup,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import { memo } from "react";

interface Props {
  grades: number[];
  onGradesChange: (grades: number[]) => void;
}

function GradeForm({ grades, onGradesChange }: Props) {
  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup
        value={grades}
        onChange={(value) => onGradesChange(value.map(Number))}
      >
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

export default memo(GradeForm);
