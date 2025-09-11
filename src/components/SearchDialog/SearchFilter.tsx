import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { SearchOption } from "../../types";

interface Props {
  searchQuery: string | undefined;
  onChange: (field: keyof SearchOption, value: any) => void;
}

export const SearchFilter = ({ searchQuery, onChange }: Props) => {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={searchQuery}
        onChange={(e) => onChange("query", e.target.value)}
      />
    </FormControl>
  );
};
