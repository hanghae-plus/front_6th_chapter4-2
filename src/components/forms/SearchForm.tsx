import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { memo } from "react";

interface Props {
  keyword?: string;
  onKeywordChange: (keyword: string) => void;
}

function SearchForm({ keyword, onKeywordChange }: Props) {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
      />
    </FormControl>
  );
}

export default memo(SearchForm);
