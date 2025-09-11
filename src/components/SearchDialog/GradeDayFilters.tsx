import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from '@chakra-ui/react';
import { memo } from 'react';
import { DAY_LABELS } from '../../constants';
import { gradeDayComparison } from '../../utils/memoComparison';

interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

interface GradeDayFiltersProps {
  grades: number[];
  days: string[];
  onChange: (
    field: keyof SearchOption,
    value: SearchOption[keyof SearchOption],
  ) => void;
}

const GradeDayFilters = memo(
  ({ grades, days, onChange }: GradeDayFiltersProps) => {
    return (
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>학년</FormLabel>
          <CheckboxGroup
            value={grades}
            onChange={(value) => onChange('grades', value.map(Number))}
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

        <FormControl>
          <FormLabel>요일</FormLabel>
          <CheckboxGroup
            value={days}
            onChange={(value) => onChange('days', value as string[])}
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
      </HStack>
    );
  },
  gradeDayComparison,
);

GradeDayFilters.displayName = 'GradeDayFilters';

export default GradeDayFilters;
