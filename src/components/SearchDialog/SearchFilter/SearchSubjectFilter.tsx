import React, { memo } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { SearchOption } from "../../../types";

export const SearchSubjectFilter = memo(
  ({
    searchOptions,
    onChange,
  }: {
    searchOptions: SearchOption["query"];
    onChange: (value: SearchOption["query"]) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>검색어</FormLabel>
        <Input
          placeholder="과목명 또는 과목코드"
          value={searchOptions}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormControl>
    );
  }
);

SearchSubjectFilter.displayName = "SearchSubjectFilter";
