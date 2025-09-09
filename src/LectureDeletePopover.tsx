import { memo } from "react";
import {
  Button,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Text,
} from "@chakra-ui/react";
import { useScheduleSetter } from "./ScheduleContext.tsx";
import { Schedule } from "./types.ts";

interface LectureDeletePopoverProps {
  tableId: string;
  data: Schedule;
}

export const LectureDeletePopover = memo(
  ({ tableId, data }: LectureDeletePopoverProps) => {
    console.log("LectureDeletePopover rerender!");
    const { deleteScheduleItem } = useScheduleSetter();
    return (
      <PopoverContent onClick={(event) => event.stopPropagation()}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text>강의를 삭제하시겠습니까?</Text>
          <Button
            colorScheme="red"
            size="xs"
            onClick={() => deleteScheduleItem(tableId, data)}
          >
            삭제
          </Button>
        </PopoverBody>
      </PopoverContent>
    );
  }
);
