import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { memo, useCallback } from 'react';
import { SearchOption } from '.';

interface Props {
  query: string;
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
}

const SearchInput = memo(({ query, changeSearchOption }: Props) => {
  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      changeSearchOption('query', e.target.value);
    },
    [changeSearchOption]
  );

  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input placeholder="과목명 또는 과목코드" value={query} onChange={handleQueryChange} />
    </FormControl>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
