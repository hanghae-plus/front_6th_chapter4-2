import {
  HStack,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { DAY_LABELS } from '../../../../constants.ts';
import { SearchOption } from '../../../../SearchDialog.tsx';

export const CheckDays = ({
  searchOptions,
  onChange,
}: {
  searchOptions: SearchOption;
  onChange: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
}) => {
  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup
        value={searchOptions.days}
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
};
