import { Checkbox, CheckboxGroup, HStack } from "@chakra-ui/react";

import { FormControl, FormLabel } from "@chakra-ui/react";
import { memo } from "react";
import { SearchOption } from "../../../types.ts";

interface Props {
  grades: number[], 
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void 
}

const GradesCheckboxGroup = ({ grades, changeSearchOption }: Props) => {
  return (
    <>
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup
          value={grades}
          onChange={(value) => changeSearchOption('grades', value.map(Number))}
        >
          <HStack spacing={4}>
            {[1, 2, 3, 4].map(grade => (
              <Checkbox key={grade} value={grade}>{grade}학년</Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    </>
  );
};
GradesCheckboxGroup.displayName = 'GradesCheckboxGroup';

export default memo(GradesCheckboxGroup, (prevProps, nextProps) => {
  return (
    prevProps.grades === nextProps.grades && 
    prevProps.changeSearchOption === nextProps.changeSearchOption
  );
});