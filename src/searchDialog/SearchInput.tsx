import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { memo } from "react";

interface Props {
  query: string | undefined;
  handleQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ query, handleQueryChange }: Props) => {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={query}
        onChange={handleQueryChange}
      />
    </FormControl>
  );
};

export default memo(SearchInput);
