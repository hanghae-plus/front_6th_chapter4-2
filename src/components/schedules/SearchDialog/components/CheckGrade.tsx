import { FormControl, FormLabel } from '@chakra-ui/react/form-control';
import { Checkbox, CheckboxGroup } from '@chakra-ui/react/checkbox';
import { HStack } from '@chakra-ui/react/stack';

import { memo } from 'react';
import { SearchOption } from '../../../../types.ts';

const CheckGrade = memo(
  ({
    selectedGrades,
    onChange,
  }: {
    selectedGrades: number[];
    onChange: (
      field: keyof SearchOption,
      value: SearchOption[typeof field]
    ) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup
          value={selectedGrades}
          onChange={value => onChange('grades', value.map(Number))}
        >
          <HStack spacing={4}>
            {[1, 2, 3, 4].map(grade => (
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

export default CheckGrade;
