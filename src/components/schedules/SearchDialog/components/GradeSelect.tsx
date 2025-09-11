import { FormControl, FormLabel } from '@chakra-ui/react/form-control';
import { Select } from '@chakra-ui/react/select';
import { memo } from 'react';
import { SearchOption } from '../../../../types.ts';

export const GradeSelect = memo(
  ({
    selectedCredits,
    changeSearchOption,
  }: {
    selectedCredits?: number;
    changeSearchOption: (
      field: keyof SearchOption,
      value: SearchOption[typeof field]
    ) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select
          value={selectedCredits}
          onChange={e => changeSearchOption('credits', e.target.value)}
        >
          <option value="">전체</option>
          <option value="1">1학점</option>
          <option value="2">2학점</option>
          <option value="3">3학점</option>
        </Select>
      </FormControl>
    );
  }
);
