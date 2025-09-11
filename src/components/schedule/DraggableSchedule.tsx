import { Box, Popover, PopoverTrigger, Text } from "@chakra-ui/react";
import { CellSize, DAY_LABELS } from "../../constants";
import { Schedule } from "../../types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { memo } from "react";
import { useAutoCallback } from "../../hooks";
import { DeleteConfirmation } from "./DeleteConfirmation";

interface Props {
  id: string;
  data: Schedule;
  bg?: string;
  onDeleteButtonClick: ({ day, time }: { day: string; time: number }) => void;
}

export const DraggableSchedule = memo(
  ({ id, data, bg, onDeleteButtonClick }: Props) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    const handleDeleteButtonClick = useAutoCallback(() => {
      onDeleteButtonClick({ day, time: range[0] });
    });

    return (
      <Popover>
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
        <DeleteConfirmation onConfirm={handleDeleteButtonClick} />
      </Popover>
    );
  }
);

DraggableSchedule.displayName = "DraggableSchedule";
