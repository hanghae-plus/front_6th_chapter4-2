import { memo } from "react";
import { CheckboxGroup, FormControl, FormLabel, HStack, Input, Select, Stack, VStack } from "@chakra-ui/react";

import GradeCheckboxes from "../components/GradeCheckboxes.tsx";
import DayCheckboxes from "../components/DayCheckboxes.tsx";
import TimeSlotCheckboxes from "../components/TimeSlotCheckboxes.tsx";
import SelectedTimeTags from "../components/SelectedTimeTags.tsx";
import MajorCheckboxes from "../components/MajorCheckboxes.tsx";
import SelectedMajorTags from "../components/SelectedMajorTags.tsx";

interface SearchFiltersProps {
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  credits: string;
  onCreditsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  grades: number[];
  onGradesChange: (value: (string | number)[]) => void;
  days: string[];
  onDaysChange: (value: (string | number)[]) => void;
  times: number[];
  onTimesChange: (values: (string | number)[]) => void;
  onRemoveTime: (timeToRemove: number) => void;
  majors: string[];
  onMajorsChange: (values: (string | number)[]) => void;
  onRemoveMajor: (majorToRemove: string) => void;
  allMajors: string[];
}

// 검색 필터 섹션을 독립 컴포넌트로 분리
const SearchFilters = ({
  query,
  onQueryChange,
  credits,
  onCreditsChange,
  grades,
  onGradesChange,
  days,
  onDaysChange,
  times,
  onTimesChange,
  onRemoveTime,
  majors,
  onMajorsChange,
  onRemoveMajor,
  allMajors,
}: SearchFiltersProps) => {
  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>검색어</FormLabel>
          <Input placeholder="과목명 또는 과목코드" value={query} onChange={onQueryChange} />
        </FormControl>

        <FormControl>
          <FormLabel>학점</FormLabel>
          <Select value={credits} onChange={onCreditsChange}>
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
          <CheckboxGroup value={grades} onChange={onGradesChange}>
            <HStack spacing={4}>
              <GradeCheckboxes />
            </HStack>
          </CheckboxGroup>
        </FormControl>

        <FormControl>
          <FormLabel>요일</FormLabel>
          <CheckboxGroup value={days} onChange={onDaysChange}>
            <HStack spacing={4}>
              <DayCheckboxes />
            </HStack>
          </CheckboxGroup>
        </FormControl>
      </HStack>

      <HStack spacing={4}>
        <FormControl>
          <FormLabel>시간</FormLabel>
          <CheckboxGroup colorScheme="green" value={times} onChange={onTimesChange}>
            <SelectedTimeTags times={times} onRemove={onRemoveTime} />
            <Stack
              spacing={2}
              overflowY="auto"
              h="100px"
              border="1px solid"
              borderColor="gray.200"
              borderRadius={5}
              p={2}
            >
              <TimeSlotCheckboxes />
            </Stack>
          </CheckboxGroup>
        </FormControl>

        <FormControl>
          <FormLabel>전공</FormLabel>
          <CheckboxGroup colorScheme="green" value={majors} onChange={onMajorsChange}>
            <SelectedMajorTags majors={majors} onRemove={onRemoveMajor} />
            <Stack
              spacing={2}
              overflowY="auto"
              h="100px"
              border="1px solid"
              borderColor="gray.200"
              borderRadius={5}
              p={2}
            >
              <MajorCheckboxes allMajors={allMajors} />
            </Stack>
          </CheckboxGroup>
        </FormControl>
      </HStack>
    </VStack>
  );
};

SearchFilters.displayName = "SearchFilters";

export default memo(SearchFilters);
