import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { SearchOption } from '../SearchDialog';
import React from 'react';

const FormSearch = React.memo(
  ({
    query,
    changeSearchOption,
    formLabel,
    placeholder,
  }: {
    query?: string;
    changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
    formLabel: string;
    placeholder: string;
  }) => {
    return (
      <FormControl>
        <FormLabel>{formLabel}</FormLabel>
        <Input
          placeholder={placeholder}
          value={query}
          onChange={e => changeSearchOption('query', e.target.value)}
        />
      </FormControl>
    );
  }
);

export default FormSearch;
