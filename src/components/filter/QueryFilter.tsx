import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { SearchOption } from '../../types.ts';

interface QueryFilterProps {
  query: SearchOption['query'];
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
}

const QueryFilter = ({ query, changeSearchOption }: QueryFilterProps) => {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={query}
        onChange={(e) => changeSearchOption('query', e.target.value)}
      />
    </FormControl>
  );
};

export default React.memo(QueryFilter);
