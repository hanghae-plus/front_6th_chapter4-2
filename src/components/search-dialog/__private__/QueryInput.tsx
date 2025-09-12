import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { type ChangeEvent, memo, useCallback } from "react";

type QueryInputProps = {
  value?: string;
  onChange: (value: string) => void;
};

export function QueryInput({ value, onChange }: QueryInputProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input placeholder="과목명 또는 과목코드" value={value} onChange={handleChange} />
    </FormControl>
  );
}

export const MemoizedQueryInput = memo(QueryInput);
