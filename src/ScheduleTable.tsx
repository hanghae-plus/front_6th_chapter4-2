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
import { CellSize, DAY_LABELS } from "./constants.ts";
import { Schedule } from "./types.ts";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentProps, memo, useMemo } from "react";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";
import TableGrid from "./components/ScheduleTable/TableGrid.tsx";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    const colorMap = useMemo(() => {
      const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
      const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
      const map = new Map<string, string>();
      lectures.forEach((id, index) => {
        map.set(id, colors[index % colors.length]);
      });
      return map;
    }, [schedules]);

    const getColor = useAutoCallback((lectureId: string): string => {
      return colorMap.get(lectureId) || "#fdd";
    });

    const dndContext = useDndContext();

    const getActiveTableId = () => {
      const activeId = dndContext.active?.id;
      if (activeId) {
        return String(activeId).split(":")[0];
      }
      return null;
    };

    const activeTableId = getActiveTableId();

    // useAutoCallback을 사용하여 핸들러 최적화
    const handleScheduleTimeClick = useAutoCallback(
      (timeInfo: { day: string; time: number }) => {
        onScheduleTimeClick?.(timeInfo);
      }
    );

    const handleDeleteButtonClick = useAutoCallback(
      (day: string, time: number) => {
        onDeleteButtonClick?.({ day, time });
      }
    );

    return (
      <Box
        position="relative"
        outline={activeTableId === tableId ? "5px dashed" : undefined}
        outlineColor="blue.300"
      >
        <TableGrid onScheduleTimeClick={handleScheduleTimeClick} />

        {schedules.map((schedule, index) => (
          <DraggableSchedule
            key={`${schedule.lecture.title}-${index}`}
            id={`${tableId}:${index}`}
            data={schedule}
            bg={getColor(schedule.lecture.id)}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
      </Box>
    );
  }
);

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
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });
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
            <BoxText title={lecture.title} room={room} />
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
              onClick={() => onDeleteButtonClick(day, range[0])}
            >
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
);

const BoxText = memo(({ title, room }: { title: string; room?: string }) => {
  return (
    <>
      <Text fontSize="sm" fontWeight="bold">
        {title}
      </Text>
      <Text fontSize="xs">{room}</Text>
    </>
  );
});

export default ScheduleTable;
