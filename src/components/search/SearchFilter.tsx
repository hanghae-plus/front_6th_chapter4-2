import { memo } from "react";
import { VStack, HStack } from "@chakra-ui/react";
import { SearchOption } from "../../types";
import BasicFilter from "../filters/BasicFilter";
import GradeFilter from "../filters/GradeFilter";
import DayFilter from "../filters/DayFilter";
import TimeFilter from "../filters/TimeFilter";
import MajorFilter from "../filters/MajorFilter";

interface Props {
  searchOptions: SearchOption;
  gradeCheckboxes: React.ReactElement[];
  dayCheckboxes: React.ReactElement[];
  timeSlotCheckboxes: React.ReactElement[];
  allMajors: string[];
  onChangeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[keyof SearchOption]
  ) => void;
}

const SearchFilter = memo(
  ({
    searchOptions,
    gradeCheckboxes,
    dayCheckboxes,
    timeSlotCheckboxes,
    allMajors,
    onChangeSearchOption,
  }: Props) => {
    return (
      <VStack spacing={4} align="stretch">
        <BasicFilter
          query={searchOptions.query}
          credits={searchOptions.credits}
          onChangeSearchOption={onChangeSearchOption}
        />

        <HStack spacing={4}>
          <GradeFilter
            grades={searchOptions.grades}
            gradeCheckboxes={gradeCheckboxes}
            onChangeSearchOption={onChangeSearchOption}
          />

          <DayFilter
            days={searchOptions.days}
            dayCheckboxes={dayCheckboxes}
            onChangeSearchOption={onChangeSearchOption}
          />
        </HStack>

        <HStack spacing={4}>
          <TimeFilter
            times={searchOptions.times}
            timeSlotCheckboxes={timeSlotCheckboxes}
            onChangeSearchOption={onChangeSearchOption}
          />

          <MajorFilter
            majors={searchOptions.majors}
            allMajors={allMajors}
            onChangeSearchOption={onChangeSearchOption}
          />
        </HStack>
      </VStack>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.searchOptions.query === nextProps.searchOptions.query &&
      prevProps.searchOptions.credits === nextProps.searchOptions.credits &&
      prevProps.searchOptions.grades.length ===
        nextProps.searchOptions.grades.length &&
      prevProps.searchOptions.days.length ===
        nextProps.searchOptions.days.length &&
      prevProps.searchOptions.times.length ===
        nextProps.searchOptions.times.length &&
      prevProps.searchOptions.majors.length ===
        nextProps.searchOptions.majors.length &&
      prevProps.gradeCheckboxes === nextProps.gradeCheckboxes &&
      prevProps.dayCheckboxes === nextProps.dayCheckboxes &&
      prevProps.timeSlotCheckboxes === nextProps.timeSlotCheckboxes &&
      prevProps.allMajors.length === nextProps.allMajors.length &&
      prevProps.onChangeSearchOption === nextProps.onChangeSearchOption
    );
  }
);

export default SearchFilter;
