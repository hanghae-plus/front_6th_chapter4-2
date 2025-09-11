import { FormControl, FormLabel, CheckboxGroup, HStack, Checkbox } from '@chakra-ui/react';
import { SearchOption } from '../SearchDialog';
import React from 'react';

const GRADE_OPTIONS = [1, 2, 3, 4];

const FormGrades = React.memo(
  ({
    grades,
    changeSearchOption,
  }: {
    grades: number[];
    changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup
          value={grades}
          onChange={value => changeSearchOption('grades', value.map(Number))}
        >
          <HStack spacing={4}>
            {GRADE_OPTIONS.map(grade => (
              <Checkbox key={grade} value={grade}>
                {grade}학년
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    );
  }
);

export default FormGrades;
