import { VStack } from "@chakra-ui/react";
import SearchQueryCreditsFilter from "./filters/SearchQueryCreditsFilter";
import SearchGradeDayFilter from "./filters/SearchGradeDayFilter";
import SearchTimeMajorFilter from "./filters/SearchTimeMajorFilter";
import { SearchOption } from "../types.ts";

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

      <SearchGradeDayFilter
        grades={searchOptions.grades}
        days={searchOptions.days}
        onSearchOptionChange={onSearchOptionChange}
      />

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
