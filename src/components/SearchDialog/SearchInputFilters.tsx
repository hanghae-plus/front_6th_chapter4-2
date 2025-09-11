import { memo } from "react";
import { FormControl, FormLabel, Input, Select, HStack } from "@chakra-ui/react";

interface SearchInputFiltersProps {
  query: string;
  credits?: number;
  onQueryChange: (query: string) => void;
  onCreditsChange: (credits: string) => void;
}

const SearchInputFilters = memo(
  ({ query, credits, onQueryChange, onCreditsChange }: SearchInputFiltersProps) => {
    return (
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>검색어</FormLabel>
          <Input placeholder="과목명 또는 과목코드" value={query} onChange={(e) => onQueryChange(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>학점</FormLabel>
          <Select value={credits || ""} onChange={(e) => onCreditsChange(e.target.value)}>
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
    // 커스텀 비교 함수: 실제 값만 비교
    return (
      prevProps.query === nextProps.query &&
      prevProps.credits === nextProps.credits &&
      prevProps.onQueryChange === nextProps.onQueryChange &&
      prevProps.onCreditsChange === nextProps.onCreditsChange
    );
  }
);

SearchInputFilters.displayName = "SearchInputFilters";

export default SearchInputFilters;
