import {
  HStack,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { DAY_LABELS } from '../../../../constants.ts';
import { SearchOption } from '../SearchDialog.tsx';
import { memo } from 'react';

export const CheckDays = memo(
  ({
    selectedDays,
    onChange,
  }: {
    selectedDays: string[];
    onChange: (
      field: keyof SearchOption,
      value: SearchOption[typeof field]
    ) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>요일</FormLabel>
        <CheckboxGroup
          value={selectedDays}
          onChange={value => onChange('days', value as string[])}
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
