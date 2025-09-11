import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { SearchOption } from "../../types";

interface Props {
  selectedCredit: number | undefined;
  onChange: (field: keyof SearchOption, value: any) => void;
}

export const CreditFilter = ({ selectedCredit, onChange }: Props) => {
  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select value={selectedCredit} onChange={(e) => onChange("credits", e.target.value)}>
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  );
};
