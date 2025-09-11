import { ComponentProps, memo } from "react";
import { PopoverTrigger } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { CellSize, DAY_LABELS } from "./constants.ts";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { Schedule } from "./types.ts";
import { Text } from "@chakra-ui/react";

interface LectureItemPopoverProps {
  data: Schedule;
  bg: ComponentProps<typeof Box>["bg"];
  id: string;
}

export const LectureItemPopover = memo(
  ({ data, bg, id }: LectureItemPopoverProps) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });

    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;
    return (
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
    );
  }
);
