import { memo } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

interface Props {
  query: string;
  onChange: (value: string) => void;
}

const QueryFilter = memo(({ query, onChange }: Props) => {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
});

QueryFilter.displayName = "QueryFilter";

export default QueryFilter;
