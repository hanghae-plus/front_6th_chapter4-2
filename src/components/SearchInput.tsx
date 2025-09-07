import { memo } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

// 검색어 입력 컴포넌트
const SearchInput = memo(({ value, onChange }: Props) => {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
