import { memo, useCallback } from "react";
import { HStack, VStack } from "@chakra-ui/react";
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
    [onChangeSearchOption],
  );

  const handleSearchOptionChange = useCallback(
    (field: keyof SearchOption, value: any) => {
      if (field === "query") {
        debouncedSetSearchOptions(field, value);
      } else {
        onChangeSearchOption(field, value);
      }
    },
    [debouncedSetSearchOptions, onChangeSearchOption],
  );

  return (
    <VStack spacing={4} align="stretch">
      <BasicFilter
        query={searchOptions.query}
        credits={searchOptions.credits}
        onChangeSearchOption={handleSearchOptionChange}
      />
      <HStack>
        <DayFilter days={searchOptions.days} onChangeSearchOption={handleSearchOptionChange} />
        <GradeFilter grades={searchOptions.grades} onChangeSearchOption={handleSearchOptionChange} />
      </HStack>
      <TimeAndMajorFilter
        times={searchOptions.times}
        majors={searchOptions.majors}
        allMajors={allMajors}
        onChangeSearchOption={handleSearchOptionChange}
      />
    </VStack>
  );
};

export default memo(SearchFilter, (prevProps, nextProps) => {
  return (
    prevProps.searchOptions.query === nextProps.searchOptions.query &&
    prevProps.searchOptions.credits === nextProps.searchOptions.credits &&
    prevProps.searchOptions.grades.toString() === nextProps.searchOptions.grades.toString() &&
    prevProps.searchOptions.days.toString() === nextProps.searchOptions.days.toString() &&
    prevProps.searchOptions.times.toString() === nextProps.searchOptions.times.toString() &&
    prevProps.searchOptions.majors.toString() === nextProps.searchOptions.majors.toString() &&
    prevProps.allMajors.toString() === nextProps.allMajors.toString()
  );
});
