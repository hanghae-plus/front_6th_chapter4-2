import { memo } from "react";
import { Schedule } from "./types";
import { ComponentProps } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { DAY_LABELS } from "./constants";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { CellSize } from "./constants";
import { CSS } from "@dnd-kit/utilities";

const DraggableSchedule = memo(
  ({
    id,
    data,
    bg,
    onDeleteButtonClick,
  }: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
      onDeleteButtonClick: (day: string, time: number) => void;
    }) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    return (
      <Popover isLazy>
        <PopoverTrigger>
          <Box
            position="absolute"
            left={`${120 + CellSize.WIDTH * leftIndex + 1}px`}
            top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
            width={CellSize.WIDTH - 1 + "px"}
            height={CellSize.HEIGHT * size - 1 + "px"}
            bg={bg}
            p={1}
            boxSizing="border-box"
            cursor="pointer"
            ref={setNodeRef}
            transform={CSS.Translate.toString(transform)}
            {...listeners}
            {...attributes}
          >
            <Text fontSize="sm" fontWeight="bold">
              {lecture.title}
            </Text>
            <Text fontSize="xs">{room}</Text>
          </Box>
        </PopoverTrigger>
        <PopoverContent onClick={(event) => event.stopPropagation()}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Text>강의를 삭제하시겠습니까?</Text>
            <Button colorScheme="red" size="xs" onClick={() => onDeleteButtonClick(day, range[0])}>
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  },
  (prev, next) => {
    return (
      prev.id === next.id &&
      prev.bg === next.bg &&
      prev.data.lecture.id === next.data.lecture.id &&
      prev.data.lecture.title === next.data.lecture.title &&
      prev.data.day === next.data.day &&
      prev.data.room === next.data.room &&
      JSON.stringify(prev.data.range) === JSON.stringify(next.data.range) &&
      prev.onDeleteButtonClick === next.onDeleteButtonClick
    );
  }
);

DraggableSchedule.displayName = "DraggableSchedule";

export default DraggableSchedule;
