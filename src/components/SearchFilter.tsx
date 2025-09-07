import { useCallback } from "react";
import { VStack } from "@chakra-ui/react";
import { debounce } from "lodash";
import { SearchOption } from "../types";
import BasicFilter from "./filters/BasicFilter";
import GradeFilter from "./filters/GradeFilter";
import DayFilter from "./filters/DayFilter";
import TimeAndMajorFilter from "./filters/TimeAndMajorFilter";

interface Props {
  searchOptions: SearchOption;
  allMajors: string[];
  onChangeSearchOption: (field: keyof SearchOption, value: any) => void;
}

const SearchFilter = ({ searchOptions, allMajors, onChangeSearchOption }: Props) => {
  const debouncedSetSearchOptions = useCallback(
    debounce((field: keyof SearchOption, value: any) => {
      onChangeSearchOption(field, value);
    }, 300),
    [onChangeSearchOption]
  );

  const handleSearchOptionChange = useCallback(
    (field: keyof SearchOption, value: any) => {
      if (field === "query") {
        debouncedSetSearchOptions(field, value);
      } else {
        onChangeSearchOption(field, value);
      }
    },
    [debouncedSetSearchOptions, onChangeSearchOption]
  );

  return (
    <VStack spacing={4} align="stretch">
      <BasicFilter
        query={searchOptions.query}
        credits={searchOptions.credits}
        onChangeSearchOption={handleSearchOptionChange}
      />
      <DayFilter
        days={searchOptions.days}
        onChangeSearchOption={handleSearchOptionChange}
      />
      <GradeFilter
        grades={searchOptions.grades}
        onChangeSearchOption={handleSearchOptionChange}
      />
      <TimeAndMajorFilter
        times={searchOptions.times}
        majors={searchOptions.majors}
        allMajors={allMajors}
        onChangeSearchOption={handleSearchOptionChange}
      />
    </VStack>
  );
};

export default SearchFilter;