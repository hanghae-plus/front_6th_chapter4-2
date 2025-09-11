import { memo } from "react";
import { FormControl, FormLabel, CheckboxGroup, Checkbox, HStack } from "@chakra-ui/react";
import { DAY_LABELS } from "../../constants";

interface GradeDayFiltersProps {
  grades: number[];
  days: string[];
  onGradesChange: (grades: number[]) => void;
  onDaysChange: (days: string[]) => void;
}

const GradeDayFilters = memo(
  ({ grades, days, onGradesChange, onDaysChange }: GradeDayFiltersProps) => {
    return (
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>학년</FormLabel>
          <CheckboxGroup value={grades} onChange={(value) => onGradesChange(value.map(Number))}>
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
          <CheckboxGroup value={days} onChange={(value) => onDaysChange(value as string[])}>
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
  (prevProps, nextProps) => {
    // 배열 비교를 위한 커스텀 로직
    const gradesEqual =
      prevProps.grades.length === nextProps.grades.length &&
      prevProps.grades.every((grade, index) => grade === nextProps.grades[index]);

    const daysEqual =
      prevProps.days.length === nextProps.days.length &&
      prevProps.days.every((day, index) => day === nextProps.days[index]);

    return (
      gradesEqual &&
      daysEqual &&
      prevProps.onGradesChange === nextProps.onGradesChange &&
      prevProps.onDaysChange === nextProps.onDaysChange
    );
  }
);

GradeDayFilters.displayName = "GradeDayFilters";

export default GradeDayFilters;
