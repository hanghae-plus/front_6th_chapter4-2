import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { memo } from "react";
import { SearchOption } from "../../../types.ts";

interface Props {
  credits: number | undefined, 
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void 
}

const CreditsSelect = ({ credits, changeSearchOption }: Props) => {
  return (
    <>
      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select
          value={credits || ""}
          onChange={(e) => changeSearchOption('credits', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">전체</option>
          <option value="1">1학점</option>
          <option value="2">2학점</option>
          <option value="3">3학점</option>
        </Select>
      </FormControl>
    </>
  );
};
CreditsSelect.displayName = 'CreditsSelect';

export default memo(CreditsSelect, (prevProps, nextProps) => {
  return (
    prevProps.credits === nextProps.credits && 
    prevProps.changeSearchOption === nextProps.changeSearchOption
  );
});