import React, { memo } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { SearchOption } from "../../types";

export const SearchSubjectFilter = memo(
  ({
    searchOptions,
    changeSearchOption,
  }: {
    searchOptions: SearchOption["query"];
    changeSearchOption: (
      field: keyof SearchOption,
      value: SearchOption[typeof field]
    ) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>검색어</FormLabel>
        <Input
          placeholder="과목명 또는 과목코드"
          value={searchOptions}
          onChange={(e) => changeSearchOption("query", e.target.value)}
        />
      </FormControl>
    );
  }
);
