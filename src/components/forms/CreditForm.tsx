import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { memo } from "react";

interface Props {
  credits?: number;
  onCreditsChange: (credits: number) => void;
}

function CreditForm({ credits, onCreditsChange }: Props) {
  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select
        value={credits}
        onChange={(e) => onCreditsChange(Number(e.target.value))}
      >
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  );
}

export default memo(CreditForm);
