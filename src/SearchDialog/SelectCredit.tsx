import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { memo, useCallback } from 'react';
import { SearchOption } from '.';

interface Props {
  credits: number;
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
}

const SelectCredit = memo(({ credits, changeSearchOption }: Props) => {
  const handleCreditChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      changeSearchOption('credits', e.target.value);
    },
    [changeSearchOption]
  );

  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select value={credits} onChange={handleCreditChange}>
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  );
});

SelectCredit.displayName = 'SelectCredit';

export default SelectCredit;
