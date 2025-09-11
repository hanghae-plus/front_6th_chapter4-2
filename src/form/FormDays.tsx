import { FormControl, FormLabel, CheckboxGroup, HStack, Checkbox } from '@chakra-ui/react';
import { SearchOption } from '../SearchDialog';
import React from 'react';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토'];

const FormDays = React.memo(
  ({
    days,
    changeSearchOption,
  }: {
    days: string[];
    changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>요일</FormLabel>
        <CheckboxGroup
          value={days}
          onChange={value => changeSearchOption('days', value as string[])}
        >
          <HStack spacing={4}>
            {DAY_LABELS.map(day => (
              <Checkbox key={day} value={day}>
                {day}
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    );
  }
);

export default FormDays;
