import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { memo } from "react";
import { SearchOption } from "../../../types.ts";
import { DAY_LABELS } from "../../../constants.ts";

interface Props {
  days: string[], 
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void 
}

const DaysCheckboxGroup = ({ days, changeSearchOption }: Props) => {
  return (
    <>
      <FormControl>
        <FormLabel>요일</FormLabel>
        <CheckboxGroup
          value={days}
          onChange={(value) => changeSearchOption('days', value as string[])}
        >
          <HStack spacing={4}>
            {DAY_LABELS.map(day => (
              <Checkbox key={day} value={day}>{day}</Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    </>
  );
};
DaysCheckboxGroup.displayName = 'DaysCheckboxGroup';

export default memo(DaysCheckboxGroup, (prevProps, nextProps) => {
  return (
    prevProps.days === nextProps.days && 
    prevProps.changeSearchOption === nextProps.changeSearchOption
  );
});