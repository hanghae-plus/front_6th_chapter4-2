import { VStack, HStack } from "@chakra-ui/react";
import SearchQueryCreditsFilter from "./filters/SearchQueryCreditsFilter";
import SearchTimeMajorFilter from "./filters/SearchTimeMajorFilter";
import { SearchOption } from "../types.ts";
import SearchDayFilter from "./filters/SearchDayFilter.tsx";
import SearchGradeFilter from "./filters/SearchGradeFilter.tsx";

interface SearchFiltersProps {
  searchOptions: SearchOption;
  allMajors: string[];
  onSearchOptionChange: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
}

const SearchFilters = ({
  searchOptions,
  allMajors,
  onSearchOptionChange,
}: SearchFiltersProps) => {
  return (
    <VStack spacing={4} align="stretch">
      <SearchQueryCreditsFilter
        query={searchOptions.query}
        credits={searchOptions.credits}
        onSearchOptionChange={onSearchOptionChange}
      />
      <HStack spacing={4}>
        <SearchGradeFilter
          grades={searchOptions.grades}
          onSearchOptionChange={onSearchOptionChange}
        />
        <SearchDayFilter
          days={searchOptions.days}
          onSearchOptionChange={onSearchOptionChange}
        />
      </HStack>
      <SearchTimeMajorFilter
        times={searchOptions.times}
        majors={searchOptions.majors}
        allMajors={allMajors}
        onSearchOptionChange={onSearchOptionChange}
      />
    </VStack>
  );
};

export default SearchFilters;
