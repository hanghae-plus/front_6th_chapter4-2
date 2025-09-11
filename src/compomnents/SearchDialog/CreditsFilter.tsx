import { memo } from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";

interface Props {
  credits: number | undefined;
  onChange: (value: string) => void;
}

const CreditsFilter = memo(({ credits, onChange }: Props) => {
  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select value={credits || ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  );
});

CreditsFilter.displayName = "CreditsFilter";

export default CreditsFilter;
