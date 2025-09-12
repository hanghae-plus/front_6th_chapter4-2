import { memo } from 'react';
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { SearchOption } from '../../hooks/useSearchWithPagination';
import { GradeFilter } from './filters';
import { DayFilter } from './filters';
import { TimeFilter } from './filters';
import { MajorFilter } from './filters';

interface SearchFormProps {
  searchOptions: SearchOption;
  allMajors: string[];
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
  handleGradesChange: (value: number[]) => void;
  handleDaysChange: (value: string[]) => void;
  handleTimesChange: (value: number[]) => void;
  handleMajorsChange: (value: string[]) => void;
}

export const SearchForm = memo(
  ({ 
    searchOptions, 
    allMajors, 
    changeSearchOption,
    handleGradesChange,
    handleDaysChange,
    handleTimesChange,
    handleMajorsChange
  }: SearchFormProps) => {

    return (
      <VStack spacing={4} align='stretch'>
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>검색어</FormLabel>
            <Input
              placeholder='과목명 또는 과목코드'
              value={searchOptions.query}
              onChange={(e) => changeSearchOption('query', e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>학점</FormLabel>
            <Select
              value={searchOptions.credits}
              onChange={(e) => changeSearchOption('credits', e.target.value)}
            >
              <option value=''>전체</option>
              <option value='1'>1학점</option>
              <option value='2'>2학점</option>
              <option value='3'>3학점</option>
            </Select>
          </FormControl>
        </HStack>

        <HStack spacing={4}>
          <GradeFilter
            selected={searchOptions.grades}
            onChange={handleGradesChange}
          />
          <DayFilter
            selected={searchOptions.days}
            onChange={handleDaysChange}
          />
        </HStack>

        <HStack spacing={4}>
          <TimeFilter
            selected={searchOptions.times}
            onChange={handleTimesChange}
          />
          <MajorFilter
            options={allMajors}
            selected={searchOptions.majors}
            onChange={handleMajorsChange}
          />
        </HStack>
      </VStack>
    );
  }
);

SearchForm.displayName = 'SearchForm';
