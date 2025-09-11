import {
  FormControl,
  FormLabel,
  CheckboxGroup,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import { useSearchOptionsStore } from "../../../store/searchOptionsStore";
import { DAY_LABELS } from "../../../constants";

export const DayForm = () => {
  const days = useSearchOptionsStore((state) => state.searchOptions.days);
  const setDays = useSearchOptionsStore((state) => state.setDays);

  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup
        value={days}
        onChange={(value) => setDays(value as string[])}
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
  );
};
