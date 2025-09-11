import { memo } from "react";
import { FormControl, FormLabel, Input, Select, HStack } from "@chakra-ui/react";

interface SearchInputFiltersProps {
  query?: string;
  credits?: number;
  onChange: (field: string, value: string | number) => void;
}

const SearchInputFilters = memo(
  ({ query, credits, onChange }: SearchInputFiltersProps) => {
    return (
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>검색어</FormLabel>
          <Input
            placeholder="과목명 또는 과목코드"
            value={query || ""}
            onChange={(e) => onChange("query", e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>학점</FormLabel>
          <Select value={credits || ""} onChange={(e) => onChange("credits", e.target.value)}>
            <option value="">전체</option>
            <option value="1">1학점</option>
            <option value="2">2학점</option>
            <option value="3">3학점</option>
          </Select>
        </FormControl>
      </HStack>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.query === nextProps.query &&
      prevProps.credits === nextProps.credits &&
      prevProps.onChange === nextProps.onChange
    );
  }
);

SearchInputFilters.displayName = "SearchInputFilters";

export default SearchInputFilters;
