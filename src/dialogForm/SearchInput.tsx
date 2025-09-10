import { memo } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { SearchOption } from "../SearchDialog";

interface SearchInputProps {
  query: string | undefined;
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
}
export const SearchInput = memo(
  ({ query, changeSearchOption }: SearchInputProps) => {
    return (
      <FormControl>
        <FormLabel>검색어</FormLabel>
        <Input
          placeholder="과목명 또는 과목코드"
          value={query}
          onChange={(e) => changeSearchOption("query", e.target.value)}
        />
      </FormControl>
    );
  }
);
