import { memo } from "react";
import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from "@chakra-ui/react";
import { DAY_LABELS } from "./constants.ts";

interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

export interface SearchFiltersProps {
  searchOptions: SearchOption;
  onQueryChange: (query: string) => void;
  onGradesChange: (grades: number[]) => void;
  onDaysChange: (days: string[]) => void;
  onTimesChange: (times: number[]) => void;
  onMajorsChange: (majors: string[]) => void;
  onCreditsChange: (credits: number | undefined) => void;
  allMajors: string[];
}

const TIME_SLOTS = [
  { id: 1, label: "09:00~09:30" },
  { id: 2, label: "09:30~10:00" },
  { id: 3, label: "10:00~10:30" },
  { id: 4, label: "10:30~11:00" },
  { id: 5, label: "11:00~11:30" },
  { id: 6, label: "11:30~12:00" },
  { id: 7, label: "12:00~12:30" },
  { id: 8, label: "12:30~13:00" },
  { id: 9, label: "13:00~13:30" },
  { id: 10, label: "13:30~14:00" },
  { id: 11, label: "14:00~14:30" },
  { id: 12, label: "14:30~15:00" },
  { id: 13, label: "15:00~15:30" },
  { id: 14, label: "15:30~16:00" },
  { id: 15, label: "16:00~16:30" },
  { id: 16, label: "16:30~17:00" },
  { id: 17, label: "17:00~17:30" },
  { id: 18, label: "17:30~18:00" },
  { id: 19, label: "18:00~18:50" },
  { id: 20, label: "18:55~19:45" },
  { id: 21, label: "19:50~20:40" },
  { id: 22, label: "20:45~21:35" },
  { id: 23, label: "21:40~22:30" },
  { id: 24, label: "22:35~23:25" },
];

// 1) 검색어 필터
const QueryFilter = memo(
  ({ query, onChange }: { query?: string; onChange: (q: string) => void }) => (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  )
);

// 2) 학점 필터
const CreditsFilter = memo(
  ({
    credits,
    onChange,
  }: {
    credits?: number;
    onChange: (c: number | undefined) => void;
  }) => (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select
        value={credits}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : undefined)
        }
      >
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  )
);

// 3) 학년 필터
const GradesFilter = memo(
  ({
    grades,
    onChange,
  }: {
    grades: number[];
    onChange: (g: number[]) => void;
  }) => (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup
        value={grades}
        onChange={(value) =>
          onChange((value as (string | number)[]).map(Number))
        }
      >
        <HStack spacing={4}>
          {[1, 2, 3, 4].map((grade) => (
            <Checkbox key={grade} value={grade}>
              {grade}학년
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  )
);

// 4) 요일 필터
const DaysFilter = memo(
  ({ days, onChange }: { days: string[]; onChange: (d: string[]) => void }) => (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup
        value={days}
        onChange={(value) => onChange(value as string[])}
      >
        <HStack spacing={4}>
          {DAY_LABELS.map((day) => (
            <Checkbox key={day} value={day}>
              {day}
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  )
);

// 5) 시간 필터
const TimesFilter = memo(
  ({
    times,
    onChange,
  }: {
    times: number[];
    onChange: (t: number[]) => void;
  }) => (
    <FormControl>
      <FormLabel>시간</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={times}
        onChange={(values) =>
          onChange((values as (string | number)[]).map(Number))
        }
      >
        <Wrap spacing={1} mb={2}>
          {times
            .sort((a, b) => a - b)
            .map((time) => (
              <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{time}교시</TagLabel>
                <TagCloseButton
                  onClick={() => onChange(times.filter((v) => v !== time))}
                />
              </Tag>
            ))}
        </Wrap>
        <Stack
          spacing={2}
          overflowY="auto"
          h="100px"
          border="1px solid"
          borderColor="gray.200"
          borderRadius={5}
          p={2}
        >
          {TIME_SLOTS.map(({ id, label }) => (
            <Box key={id}>
              <Checkbox key={id} size="sm" value={id}>
                {id}교시({label})
              </Checkbox>
            </Box>
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  )
);

// 6) 전공 필터
const MajorsFilter = memo(
  ({
    majors,
    allMajors,
    onChange,
  }: {
    majors: string[];
    allMajors: string[];
    onChange: (m: string[]) => void;
  }) => (
    <FormControl>
      <FormLabel>전공</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={majors}
        onChange={(values) => onChange(values as string[])}
      >
        <Wrap spacing={1} mb={2}>
          {majors.map((major) => (
            <Tag key={major} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{major.split("<p>").pop()}</TagLabel>
              <TagCloseButton
                onClick={() => onChange(majors.filter((v) => v !== major))}
              />
            </Tag>
          ))}
        </Wrap>
        <Stack
          spacing={2}
          overflowY="auto"
          h="100px"
          border="1px solid"
          borderColor="gray.200"
          borderRadius={5}
          p={2}
        >
          {allMajors.map((major) => (
            <Box key={major}>
              <Checkbox key={major} size="sm" value={major}>
                {major.replace(/<p>/gi, " ")}
              </Checkbox>
            </Box>
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  )
);

// 상위 조립 컴포넌트 - 각 필터를 독립적으로 렌더
const SearchFilters = memo(
  ({
    searchOptions,
    onQueryChange,
    onGradesChange,
    onDaysChange,
    onTimesChange,
    onMajorsChange,
    onCreditsChange,
    allMajors,
  }: SearchFiltersProps) => {
    return (
      <>
        <HStack spacing={4}>
          <QueryFilter query={searchOptions.query} onChange={onQueryChange} />
          <CreditsFilter
            credits={searchOptions.credits}
            onChange={onCreditsChange}
          />
        </HStack>

        <HStack spacing={4}>
          <GradesFilter
            grades={searchOptions.grades}
            onChange={onGradesChange}
          />
          <DaysFilter days={searchOptions.days} onChange={onDaysChange} />
        </HStack>

        <HStack spacing={4}>
          <TimesFilter times={searchOptions.times} onChange={onTimesChange} />
          <MajorsFilter
            majors={searchOptions.majors}
            allMajors={allMajors}
            onChange={onMajorsChange}
          />
        </HStack>
      </>
    );
  }
);

export default SearchFilters;
