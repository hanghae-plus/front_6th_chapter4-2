import {
  FormControl,
  FormLabel,
  CheckboxGroup,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import { useSearchOptionsStore } from "../../../store/searchOptionsStore";

export const GradeForm = () => {
  const grades = useSearchOptionsStore((state) => state.searchOptions.grades);
  const setGrades = useSearchOptionsStore((state) => state.setGrades);

  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup
        value={grades}
        onChange={(value) => setGrades(value.map(Number))}
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
};
