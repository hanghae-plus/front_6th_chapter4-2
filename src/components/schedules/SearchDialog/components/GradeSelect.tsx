import { FormControl, FormLabel } from '@chakra-ui/react/form-control';
import { Select } from '@chakra-ui/react/select';
import { SearchOption } from '../../../../SearchDialog.tsx';

export const GradeSelect = ({
  searchOptions,
  changeSearchOption,
}: {
  searchOptions: SearchOption;
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
}) => {
  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select
        value={searchOptions.credits}
        onChange={e => changeSearchOption('credits', e.target.value)}
      >
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  );
};
