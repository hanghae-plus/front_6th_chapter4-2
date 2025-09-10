import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { memo } from "react";
import { SearchOption } from "../../../types.ts";

interface Props {
  query: string | undefined, 
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void 
}

const QueryInput = ({ query, changeSearchOption }: Props) => {
  return (
    <>
      <FormControl>
        <FormLabel>검색어</FormLabel>
        <Input
          placeholder="과목명 또는 과목코드"
          value={query}
          onChange={(e) => changeSearchOption('query', e.target.value)}
        />
      </FormControl>
    </>
  );
};
QueryInput.displayName = 'QueryInput';

export default memo(QueryInput, (prevProps, nextProps) => {
  return (
    prevProps.query === nextProps.query && 
    prevProps.changeSearchOption === nextProps.changeSearchOption
  );
});