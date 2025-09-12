import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { ComponentProps, MouseEvent } from "react";

import { CELL_SIZE, DAY_LABELS } from "../../../constants";
import type { Schedule } from "../../../types";

type DraggableScheduleProps = ComponentProps<typeof Box> & {
  id: string;
  data: Schedule;
  onDeleteButtonClick: () => void;
};

export function DraggableSchedule({ id, data, bg, onDeleteButtonClick, ...boxProps }: DraggableScheduleProps) {
  const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });

  const { day, range, room, lecture } = data;

  const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
  const topIndex = range[0] - 1;
  const size = range.length;

  const handlePopoverContentClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Box
          position="absolute"
          left={`${120 + CELL_SIZE.WIDTH * leftIndex + 1}px`}
          top={`${40 + (topIndex * CELL_SIZE.HEIGHT + 1)}px`}
          width={CELL_SIZE.WIDTH - 1 + "px"}
          height={CELL_SIZE.HEIGHT * size - 1 + "px"}
          bg={bg}
          p={1}
          boxSizing="border-box"
          cursor="pointer"
          ref={setNodeRef}
          transform={CSS.Translate.toString(transform)}
          {...listeners}
          {...attributes}
          {...boxProps}
        >
          <Text fontSize="sm" fontWeight="bold">
            {lecture.title}
          </Text>
          <Text fontSize="xs">{room}</Text>
        </Box>
      </PopoverTrigger>

      <PopoverContent onClick={handlePopoverContentClick}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text>강의를 삭제하시겠습니까?</Text>
          <Button colorScheme="red" size="xs" onClick={onDeleteButtonClick}>
            삭제
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
