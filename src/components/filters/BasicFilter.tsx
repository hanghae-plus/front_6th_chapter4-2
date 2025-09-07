import { memo } from "react";
import { FormControl, FormLabel, HStack, Input, Select } from "@chakra-ui/react";
import { SearchOption } from "../../types";

interface Props {
  query?: string;
  credits?: number;
  onChangeSearchOption: (field: keyof SearchOption, value: any) => void;
}

const BasicFilter = ({ query, credits, onChangeSearchOption }: Props) => {
  return (
    <HStack spacing={4}>
      <FormControl>
        <FormLabel>검색어</FormLabel>
        <Input
          placeholder="과목명 또는 과목코드"
          value={query}
          onChange={(e) => onChangeSearchOption("query", e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select 
          value={credits} 
          onChange={(e) => onChangeSearchOption("credits", e.target.value)}
        >
          <option value="">전체</option>
          <option value="1">1학점</option>
          <option value="2">2학점</option>
          <option value="3">3학점</option>
        </Select>
      </FormControl>
    </HStack>
  );
};

export default memo(BasicFilter, (prevProps, nextProps) => {
  return (
    prevProps.query === nextProps.query &&
    prevProps.credits === nextProps.credits &&
    prevProps.onChangeSearchOption === nextProps.onChangeSearchOption
  );
});
