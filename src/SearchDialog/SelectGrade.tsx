import { CheckboxGroup, FormControl, FormLabel, HStack } from '@chakra-ui/react';
import { memo, useCallback, useMemo } from 'react';
import { SearchOption } from '.';
import CheckboxItem from './CheckboxItem';

interface Props {
  grades: number[];
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
}

const SelectGrade = memo(({ grades, changeSearchOption }: Props) => {
  const handleGradeChange = useCallback(
    (value: (string | number)[]) => {
      changeSearchOption('grades', value.map(Number));
    },
    [changeSearchOption]
  );

  const allGrades = useMemo(() => [1, 2, 3, 4], []);

  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup value={grades} onChange={handleGradeChange}>
        <HStack spacing={4}>
          {allGrades.map(grade => (
            <CheckboxItem key={grade} value={grade}>
              {grade}학년
            </CheckboxItem>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
});

SelectGrade.displayName = 'SelectGrade';

export default SelectGrade;
