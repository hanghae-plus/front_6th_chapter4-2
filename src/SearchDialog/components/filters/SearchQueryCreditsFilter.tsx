import React, { useCallback } from "react";
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import { SearchOption } from "../../types.ts";

interface SearchQueryCreditsFilterProps {
  query?: string;
  credits?: number;
  onSearchOptionChange: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
}

const SearchQueryCreditsFilter = React.memo(
  ({
    query = "",
    credits,
    onSearchOptionChange,
  }: SearchQueryCreditsFilterProps) => {
    const handleQueryChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchOptionChange("query", e.target.value);
      },
      [onSearchOptionChange]
    );

    const handleCreditsChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSearchOptionChange(
          "credits",
          e.target.value ? Number(e.target.value) : undefined
        );
      },
      [onSearchOptionChange]
    );

    return (
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>검색어</FormLabel>
          <Input
            placeholder="과목명 또는 과목코드"
            value={query}
            onChange={handleQueryChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>학점</FormLabel>
          <Select value={credits || ""} onChange={handleCreditsChange}>
            <option value="">전체</option>
            <option value="1">1학점</option>
            <option value="2">2학점</option>
            <option value="3">3학점</option>
          </Select>
        </FormControl>
      </HStack>
    );
  }
);

SearchQueryCreditsFilter.displayName = "SearchQueryCreditsFilter";

export default SearchQueryCreditsFilter;
