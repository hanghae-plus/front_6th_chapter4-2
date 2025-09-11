import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useSearchOptionsStore } from "../../../store/searchOptionsStore";

export const QueryForm = () => {
  const query = useSearchOptionsStore((state) => state.searchOptions.query);
  const setQuery = useSearchOptionsStore((state) => state.setQuery);

  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </FormControl>
  );
};
