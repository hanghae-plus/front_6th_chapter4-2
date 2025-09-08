import { useCallback, useMemo } from 'react';
import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from '@chakra-ui/react';
import { DAY_LABELS } from '../constants.ts';

interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

interface Props {
  searchOptions: SearchOption;
  allMajors: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (field: keyof SearchOption, value: any) => void;
}

const TIME_SLOTS = [
  { id: 1, label: '09:00~09:30' },
  { id: 2, label: '09:30~10:00' },
  { id: 3, label: '10:00~10:30' },
  { id: 4, label: '10:30~11:00' },
  { id: 5, label: '11:00~11:30' },
  { id: 6, label: '11:30~12:00' },
  { id: 7, label: '12:00~12:30' },
  { id: 8, label: '12:30~13:00' },
  { id: 9, label: '13:00~13:30' },
  { id: 10, label: '13:30~14:00' },
  { id: 11, label: '14:00~14:30' },
  { id: 12, label: '14:30~15:00' },
  { id: 13, label: '15:00~15:30' },
  { id: 14, label: '15:30~16:00' },
  { id: 15, label: '16:00~16:30' },
  { id: 16, label: '16:30~17:00' },
  { id: 17, label: '17:00~17:30' },
  { id: 18, label: '17:30~18:00' },
  { id: 19, label: '18:00~18:50' },
  { id: 20, label: '18:55~19:45' },
  { id: 21, label: '19:50~20:40' },
  { id: 22, label: '20:45~21:35' },
  { id: 23, label: '21:40~22:30' },
  { id: 24, label: '22:35~23:25' },
];

// 필터 옵션 컴포넌트
const FilterOptions = ({ searchOptions, allMajors, onChange }: Props) => {
  // 핸들러 함수들 메모이제이션
  const handleGradesChange = (value: (string | number)[]) =>
    onChange('grades', value.map(Number));

  const handleDaysChange = (value: (string | number)[]) =>
    onChange('days', value as string[]);

  const handleTimesChange = (values: (string | number)[]) =>
    onChange('times', values.map(Number));

  const handleMajorsChange = (values: (string | number)[]) =>
    onChange('majors', values as string[]);

  // 시간 태그 제거 핸들러
  const handleTimeRemove = useCallback(
    (timeToRemove: number) =>
      onChange(
        'times',
        searchOptions.times.filter(v => v !== timeToRemove)
      ),
    [onChange, searchOptions.times]
  );

  // 전공 태그 제거 핸들러
  const handleMajorRemove = useCallback(
    (majorToRemove: string) =>
      onChange(
        'majors',
        searchOptions.majors.filter(v => v !== majorToRemove)
      ),
    [onChange, searchOptions.majors]
  );

  // 정렬된 시간 목록
  const sortedTimes = useMemo(
    () => [...searchOptions.times].sort((a, b) => a - b),
    [searchOptions.times]
  );

  // 처리된 전공 목록 (문자열 처리)
  const processedMajors = useMemo(
    () =>
      allMajors.map(major => ({
        original: major,
        display: major.replace(/<p>/gi, ' '),
      })),
    [allMajors]
  );
  return (
    <>
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>학년</FormLabel>
          <CheckboxGroup
            value={searchOptions.grades}
            onChange={handleGradesChange}
          >
            <HStack spacing={4}>
              {[1, 2, 3, 4].map(grade => (
                <Checkbox key={grade} value={grade}>
                  {grade}학년
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
        </FormControl>

        <FormControl>
          <FormLabel>요일</FormLabel>
          <CheckboxGroup value={searchOptions.days} onChange={handleDaysChange}>
            <HStack spacing={4}>
              {DAY_LABELS.map(day => (
                <Checkbox key={day} value={day}>
                  {day}
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
        </FormControl>
      </HStack>

      <HStack spacing={4}>
        <FormControl>
          <FormLabel>시간</FormLabel>
          <CheckboxGroup
            colorScheme="green"
            value={searchOptions.times}
            onChange={handleTimesChange}
          >
            <Wrap spacing={1} mb={2}>
              {sortedTimes.map(time => (
                <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                  <TagLabel>{time}교시</TagLabel>
                  <TagCloseButton onClick={() => handleTimeRemove(time)} />
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

        <FormControl>
          <FormLabel>전공</FormLabel>
          <CheckboxGroup
            colorScheme="green"
            value={searchOptions.majors}
            onChange={handleMajorsChange}
          >
            <Wrap spacing={1} mb={2}>
              {searchOptions.majors.map(major => (
                <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                  <TagLabel>{major.split('<p>').pop()}</TagLabel>
                  <TagCloseButton onClick={() => handleMajorRemove(major)} />
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
              {processedMajors.map(({ original, display }) => (
                <Box key={original}>
                  <Checkbox key={original} size="sm" value={original}>
                    {display}
                  </Checkbox>
                </Box>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>
      </HStack>
    </>
  );
};

FilterOptions.displayName = 'FilterOptions';

export default FilterOptions;
