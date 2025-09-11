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
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { type ComponentProps, memo, useCallback, useMemo } from "react";
import ScheduleTableGrid from "./components/Table/ScheduleTableGrid";
import { useAutoCallback } from "./hooks/useAutoCallback";
import { CellSize, DAY_LABELS } from "./constants.ts";
import type { Schedule } from "./types.ts";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = memo(({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
  console.log("ScheduleTable 리렌더링", tableId);

  // 색상 맵을 useMemo로 최적화
  const colorMap = useMemo(() => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    const map = new Map<string, string>();
    lectures.forEach((id, index) => {
      map.set(id, colors[index % colors.length]);
    });
    return map;
  }, [schedules]);

  const getColor = useCallback(
    (lectureId: string): string => {
      return colorMap.get(lectureId) || "#fdd";
    },
    [colorMap]
  );

  // 각 스케줄의 bg 값을 미리 계산하고 메모이제이션
  const schedulesWithBg = useMemo(() => {
    return schedules.map((schedule) => ({
      ...schedule,
      bg: getColor(schedule.lecture.id),
    }));
  }, [schedules, getColor]);

  const dndContext = useDndContext();

  const getActiveTableId = useAutoCallback(() => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  });

  const activeTableId = getActiveTableId();

  // useAutoCallback을 사용하여 핸들러 최적화
  const handleScheduleTimeClick = useAutoCallback((timeInfo: { day: string; time: number }) => {
    onScheduleTimeClick?.(timeInfo);
  });

  const handleDeleteButtonClick = useCallback(
    (day: string, time: number) => {
      onDeleteButtonClick?.({ day, time });
    },
    [onDeleteButtonClick]
  );

  return (
    <Box position="relative" outline={activeTableId === tableId ? "5px dashed" : undefined} outlineColor="blue.300">
      <ScheduleTableGrid onScheduleTimeClick={handleScheduleTimeClick} />

      {schedulesWithBg.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.id}-${schedule.day}-${schedule.range[0]}-${schedule.room}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={schedule.bg}
          onDeleteButtonClick={handleDeleteButtonClick}
        />
      ))}
    </Box>
  );
});

ScheduleTable.displayName = "ScheduleTable";

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
    // 개별 속성 비교로 최적화
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

export default ScheduleTable;
