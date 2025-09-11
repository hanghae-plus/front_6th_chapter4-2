import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";

const SearchInput = React.memo(
  ({ value, handleChange }: { value: string; handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
      <FormControl>
        <FormLabel>검색어</FormLabel>
        <Input placeholder="과목명 또는 과목코드" value={value} onChange={handleChange} />
      </FormControl>
    );
  },
  (prevProps, nextProps) => {
    // query 값만 비교
    return prevProps.value === nextProps.value;
  },
);

export default SearchInput;
