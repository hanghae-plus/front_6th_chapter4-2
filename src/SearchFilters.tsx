import { memo, PropsWithChildren } from 'react';
import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
  Select,
  Stack,
  Text,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from '@chakra-ui/react';
import { DAY_LABELS } from './constants';

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

interface SearchProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

interface CreditsProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

interface GradesProps {
  value: number[];
  onChange: (value: number[]) => void;
}

interface DaysProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const Search = memo(({ value, onChange }: SearchProps) => (
  <FormControl>
    <FormLabel>검색어</FormLabel>
    <Input
      placeholder="과목명 또는 과목코드"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  </FormControl>
));

const Credits = memo(({ value, onChange }: CreditsProps) => (
  <FormControl>
    <FormLabel>학점</FormLabel>
    <Select value={value || ''} onChange={(e) => onChange(Number(e.target.value))}>
      <option value="">전체</option>
      <option value="1">1학점</option>
      <option value="2">2학점</option>
      <option value="3">3학점</option>
    </Select>
  </FormControl>
));

const Grades = memo(({ value, onChange }: GradesProps) => (
  <FormControl>
    <FormLabel>학년</FormLabel>
    <CheckboxGroup value={value} onChange={(values) => onChange(values.map(Number))}>
      <HStack spacing={4}>
        {[1, 2, 3, 4].map((grade) => (
          <Checkbox key={grade} value={grade}>
            {grade}학년
          </Checkbox>
        ))}
      </HStack>
    </CheckboxGroup>
  </FormControl>
));

const Days = memo(({ value, onChange }: DaysProps) => (
  <FormControl>
    <FormLabel>요일</FormLabel>
    <CheckboxGroup value={value} onChange={(values) => onChange(values as string[])}>
      <HStack spacing={4}>
        {DAY_LABELS.map((day) => (
          <Checkbox key={day} value={day}>
            {day}
          </Checkbox>
        ))}
      </HStack>
    </CheckboxGroup>
  </FormControl>
));

interface TimesProps {
  value: number[];
  onChange: (value: number[]) => void;
  onRemove?: (time: number) => void;
}

const Times = memo(({ value, onChange, onRemove }: TimesProps) => (
  <FormControl>
    <FormLabel>시간</FormLabel>
    <CheckboxGroup
      colorScheme="green"
      value={value}
      onChange={(values) => onChange(values.map(Number))}
    >
      <Wrap spacing={1} mb={2}>
        {value
          .sort((a: number, b: number) => a - b)
          .map((time: number) => (
            <Tag key={time} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{time}교시</TagLabel>
              <TagCloseButton onClick={() => onRemove?.(time)} />
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
          <TimeSlotItem key={id} id={id} label={label} />
        ))}
      </Stack>
    </CheckboxGroup>
  </FormControl>
));

interface MajorsProps {
  value: string[];
  onChange: (value: string[]) => void;
  allMajors: string[];
  onRemove?: (major: string) => void;
}

const Majors = memo(({ value, onChange, allMajors, onRemove }: MajorsProps) => (
  <FormControl>
    <FormLabel>전공</FormLabel>
    <CheckboxGroup
      colorScheme="green"
      value={value}
      onChange={(values) => onChange(values as string[])}
    >
      <Wrap spacing={1} mb={2}>
        {value.map((major: string) => (
          <Tag key={major} size="sm" variant="outline" colorScheme="blue">
            <TagLabel>{major.split('<p>').pop()}</TagLabel>
            <TagCloseButton onClick={() => onRemove?.(major)} />
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
          <CheckBoxItem key={major} major={major} />
        ))}
      </Stack>
    </CheckboxGroup>
  </FormControl>
));

const ResultCount = memo(({ count }: { count: number }) => (
  <Text align="right">검색결과: {count}개</Text>
));

const SearchFilters = ({ children }: PropsWithChildren) => {
  return (
    <VStack spacing={4} align="stretch">
      {children}
    </VStack>
  );
};

SearchFilters.Search = Search;
SearchFilters.Credits = Credits;
SearchFilters.Grades = Grades;
SearchFilters.Days = Days;
SearchFilters.Times = Times;
SearchFilters.Majors = Majors;
SearchFilters.ResultCount = ResultCount;

export { SearchFilters };

// 하위 컴포넌트들
const CheckBoxItem = memo(({ major }: { major: string }) => {
  return (
    <Box>
      <Checkbox size="sm" value={major}>
        {major.replace(/<p>/gi, ' ')}
      </Checkbox>
    </Box>
  );
});

const TimeSlotItem = memo(({ id, label }: { id: number; label: string }) => {
  return (
    <Box>
      <Checkbox size="sm" value={id}>
        {id}교시({label})
      </Checkbox>
    </Box>
  );
});
