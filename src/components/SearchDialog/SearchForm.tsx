import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { memo } from "react";
import { SearchOption } from "../../SearchDialog";

type SearchFormProps = {
  query?: string;
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
};
const SearchForm = memo(({ query, changeSearchOption }: SearchFormProps) => {
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
});

export default SearchForm;
