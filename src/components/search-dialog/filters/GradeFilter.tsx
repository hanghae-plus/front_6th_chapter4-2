import { memo } from "react";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";

interface GradeFilterProps {
  selected: number[];
  onChange: (v: number[]) => void;
}

export const GradeFilter = memo(
  ({ selected, onChange }: GradeFilterProps) => (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup
        value={selected}
        onChange={(value) => onChange((value as (string | number)[]).map(Number))}
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
  ),
  (prevProps, nextProps) =>
    prevProps.selected === nextProps.selected &&
    prevProps.onChange === nextProps.onChange
);

GradeFilter.displayName = "GradeFilter";