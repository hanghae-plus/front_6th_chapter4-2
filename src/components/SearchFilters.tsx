import { memo } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  HStack,
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";
import { DAY_LABELS } from "../constants";

interface SearchFiltersProps {
  searchOptions: {
    query?: string;
    credits?: number;
    grades: number[];
    days: string[];
  };
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreditsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onGradesChange: (value: (string | number)[]) => void;
  onDaysChange: (value: (string | number)[]) => void;
}

const SearchFilters = memo(
  ({
    searchOptions,
    onQueryChange,
    onCreditsChange,
    onGradesChange,
    onDaysChange,
  }: SearchFiltersProps) => {
    return (
      <>
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>검색어</FormLabel>
            <Input
              placeholder="과목명 또는 과목코드"
              value={searchOptions.query}
              onChange={onQueryChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>학점</FormLabel>
            <Select value={searchOptions.credits} onChange={onCreditsChange}>
              <option value="">전체</option>
              <option value="1">1학점</option>
              <option value="2">2학점</option>
              <option value="3">3학점</option>
            </Select>
          </FormControl>
        </HStack>

        <HStack spacing={4}>
          <FormControl>
            <FormLabel>학년</FormLabel>
            <CheckboxGroup
              value={searchOptions.grades}
              onChange={onGradesChange}>
              <HStack spacing={4}>
                {[1, 2, 3, 4].map((grade) => (
                  <Checkbox key={grade} value={grade}>
                    {grade}학년
                  </Checkbox>
                ))}
              </HStack>
            </CheckboxGroup>
          </FormControl>

          <FormControl>
            <FormLabel>요일</FormLabel>
            <CheckboxGroup value={searchOptions.days} onChange={onDaysChange}>
              <HStack spacing={4}>
                {DAY_LABELS.map((day) => (
                  <Checkbox key={day} value={day}>
                    {day}
                  </Checkbox>
                ))}
              </HStack>
            </CheckboxGroup>
          </FormControl>
        </HStack>
      </>
    );
  }
);

SearchFilters.displayName = "SearchFilters";

export default SearchFilters;
