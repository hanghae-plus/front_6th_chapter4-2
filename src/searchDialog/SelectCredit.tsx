import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import React, { memo } from "react";

interface Props {
  credits: number | undefined;
  handleCreditsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectCredit = ({ credits, handleCreditsChange }: Props) => {
  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select value={credits} onChange={handleCreditsChange}>
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  );
};

export default memo(SelectCredit);
