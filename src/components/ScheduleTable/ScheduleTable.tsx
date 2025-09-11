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
import { CellSize, DAY_LABELS } from "../../constants.ts";
import { Schedule } from "../../types.ts";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { memo, useCallback, useMemo } from "react";
import { ScheduleGrid } from "./ScheduleGrid.tsx";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import { useScheduleActions } from "../../context/ScheduleActionsContext.tsx";
import { useDragState } from "../../context/DragStateContext.tsx";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const SCHEDULE_COLORS = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];

const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    const { deleteSchedule } = useScheduleActions();

    const lectureIds = useMemo(
      () => [...new Set(schedules.map(({ lecture }) => lecture.id))],
      [schedules]
    );

    const getColor = useCallback(
      (lectureId: string): string => {
        return SCHEDULE_COLORS[
          lectureIds.indexOf(lectureId) % SCHEDULE_COLORS.length
        ];
      },
      [lectureIds]
    );

    const handleScheduleTimeClick = useAutoCallback(
      (timeInfo: { day: string; time: number }) => {
        onScheduleTimeClick?.(timeInfo);
      }
    );

    const handleDeleteButtonClick = useCallback(
      (day: string, time: number) => {
        deleteSchedule(tableId, day, time);
        onDeleteButtonClick?.({ day, time });
      },
      [deleteSchedule, tableId, onDeleteButtonClick]
    );

    const scheduleHandlers = useMemo(() => {
      return schedules.map((schedule, index) => ({
        key: `${schedule.lecture.title}-${index}`,
        id: `${tableId}:${index}`,
        schedule,
        color: getColor(schedule.lecture.id),
        onDelete: () =>
          handleDeleteButtonClick(schedule.day, schedule.range[0]),
      }));
    }, [schedules, tableId, getColor, handleDeleteButtonClick]);

    return (
      <ScheduleTableContainer tableId={tableId}>
        <ScheduleGrid onScheduleTimeClick={handleScheduleTimeClick} />

        {scheduleHandlers.map(({ key, id, schedule, color, onDelete }) => (
          <DraggableSchedule
            key={key}
            id={id}
            data={schedule}
            bg={color}
            onDeleteButtonClick={onDelete}
          />
        ))}
      </ScheduleTableContainer>
    );
  }
);

ScheduleTable.displayName = "ScheduleTable";

const ScheduleTableContainer = memo(
  ({ tableId, children }: { tableId: string; children: React.ReactNode }) => {
    const { activeTableId } = useDragState();

    return (
      <Box
        position="relative"
        outline={activeTableId === tableId ? "5px dashed" : undefined}
        outlineColor="blue.300"
      >
        {children}
      </Box>
    );
  }
);

ScheduleTableContainer.displayName = "ScheduleTableContainer";

interface DraggableScheduleProps {
  id: string;
  data: Schedule;
  bg: string;
  onDeleteButtonClick: () => void;
}

const DraggableSchedule = memo(
  ({ id, data, bg, onDeleteButtonClick }: DraggableScheduleProps) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });

    const position = useMemo(() => {
      const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
      const topIndex = range[0] - 1;
      const size = range.length;

      return {
        left: `${120 + CellSize.WIDTH * leftIndex + 1}px`,
        top: `${40 + (topIndex * CellSize.HEIGHT + 1)}px`,
        width: CellSize.WIDTH - 1 + "px",
        height: CellSize.HEIGHT * size - 1 + "px",
      };
    }, [day, range]);

    return (
      <Popover isLazy>
        <PopoverTrigger>
          <Box
            position="absolute"
            left={position.left}
            top={position.top}
            width={position.width}
            height={position.height}
            bg={bg}
            p={1}
            boxSizing="border-box"
            cursor="pointer"
            ref={setNodeRef}
            transform={CSS.Translate.toString(transform)}
            {...listeners}
            {...attributes}
          >
            <Text
              fontSize="sm"
              fontWeight="bold"
            >
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
            <Button
              colorScheme="red"
              size="xs"
              onClick={onDeleteButtonClick}
            >
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
);

DraggableSchedule.displayName = "DraggableSchedule";

export default ScheduleTable;
