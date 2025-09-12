import { memo } from "react";
import { Stack } from "@chakra-ui/react";

interface Props {
  timeSlotCheckboxes: React.ReactElement[];
}

const TimeSlotList = memo(
  ({ timeSlotCheckboxes }: Props) => {
    return (
      <Stack
        spacing={2}
        overflowY="auto"
        h="100px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius={5}
        p={2}
      >
        {timeSlotCheckboxes}
      </Stack>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.timeSlotCheckboxes === nextProps.timeSlotCheckboxes;
  }
);

export default TimeSlotList;
