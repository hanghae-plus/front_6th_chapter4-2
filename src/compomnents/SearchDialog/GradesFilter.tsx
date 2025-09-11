import { memo } from "react";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";

interface Props {
  grades: number[];
  onChange: (values: number[]) => void;
}

const GradesFilter = memo(({ grades, onChange }: Props) => {
  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup
        value={grades}
        onChange={(value) => onChange(value.map(Number))}
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
});

GradesFilter.displayName = "GradesFilter";

export default GradesFilter;
