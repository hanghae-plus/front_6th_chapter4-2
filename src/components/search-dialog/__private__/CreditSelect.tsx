import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { type ChangeEvent, memo, useCallback } from "react";

type CreditSelectProps = {
  value?: number;
  onChange: (value: number | undefined) => void;
};

export function CreditSelect({ value, onChange }: CreditSelectProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      onChange(val ? Number(val) : undefined);
    },
    [onChange],
  );

  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select value={value || ""} onChange={handleChange}>
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  );
}

export const MemoizedCreditSelect = memo(CreditSelect);
