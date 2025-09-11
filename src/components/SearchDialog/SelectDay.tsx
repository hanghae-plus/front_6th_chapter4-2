import { CheckboxGroup, FormControl, FormLabel, HStack } from '@chakra-ui/react';
import { memo, useCallback } from 'react';
import { DAY_LABELS } from '../../constants.ts';
import CheckboxItem from './CheckboxItem.tsx';
import { SearchOption } from './index.tsx';

interface Props {
  days: string[];
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
}

const SelectDay = memo(({ days, changeSearchOption }: Props) => {
  const handleDayChange = useCallback(
    (value: string[]) => {
      changeSearchOption('days', value);
    },
    [changeSearchOption]
  );

  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup value={days} onChange={handleDayChange}>
        <HStack spacing={4}>
          {DAY_LABELS.map(day => (
            <CheckboxItem key={day} value={day}>
              {day}
            </CheckboxItem>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
});

SelectDay.displayName = 'SelectDay';

export default SelectDay;
