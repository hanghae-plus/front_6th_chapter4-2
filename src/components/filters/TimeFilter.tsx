import { memo, useCallback } from "react";
import { FormControl, FormLabel, CheckboxGroup, Wrap } from "@chakra-ui/react";
import { SearchOption } from "../../types";
import TimeTag from "../tags/TimeTag";
import TimeSlotList from "../lists/TimeSlotList";

interface Props {
  times: number[];
  timeSlotCheckboxes: React.ReactElement[];
  onChangeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[keyof SearchOption]
  ) => void;
}

const TimeFilter = memo(
  ({ times, timeSlotCheckboxes, onChangeSearchOption }: Props) => {
    const removeTime = useCallback(
      (time: number) => {
        onChangeSearchOption(
          "times",
          times.filter((v) => v !== time)
        );
      },
      [onChangeSearchOption, times]
    );

    const handleTimesChange = useCallback(
      (values: (string | number)[]) => {
        onChangeSearchOption("times", values.map(Number));
      },
      [onChangeSearchOption]
    );

    return (
      <FormControl>
        <FormLabel>시간</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={times}
          onChange={handleTimesChange}
        >
          <Wrap spacing={1} mb={2}>
            {times
              .sort((a, b) => a - b)
              .map((time) => (
                <TimeTag key={time} time={time} onRemove={removeTime} />
              ))}
          </Wrap>
          <TimeSlotList timeSlotCheckboxes={timeSlotCheckboxes} />
        </CheckboxGroup>
      </FormControl>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.times.length === nextProps.times.length &&
      prevProps.timeSlotCheckboxes === nextProps.timeSlotCheckboxes &&
      prevProps.onChangeSearchOption === nextProps.onChangeSearchOption
    );
  }
);

export default TimeFilter;
