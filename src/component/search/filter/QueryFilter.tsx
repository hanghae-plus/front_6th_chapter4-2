import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { SearchOption } from "../../../types.ts";
import { memo } from "react";

type QueryFilterProps = {
    query: SearchOption['query'];
    changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
}

const QueryFilter = ({ query, changeSearchOption }: QueryFilterProps) => {
    return (
        <FormControl>
            <FormLabel>검색어</FormLabel>
            <Input
                placeholder="과목명 또는 과목코드"
                value={query}
                onChange={(e) => changeSearchOption('query', e.target.value)}
            />
        </FormControl>
    )
}

QueryFilter.displayName="QueryFilter";

export default memo(QueryFilter);