import { Box } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { memo, useCallback, useMemo } from "react";
import ScheduleTableGrid from "./ScheduleTableGrid.tsx";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import type { Schedule } from "../../types.ts";
import DraggableSchedule from "../../DraggableSchedule.tsx";

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

      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.id}-${schedule.day}-${schedule.range[0]}-${schedule.room}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedule.lecture.id)}
          onDeleteButtonClick={handleDeleteButtonClick}
        />
      ))}
    </Box>
  );
});

ScheduleTable.displayName = "ScheduleTable";

export default ScheduleTable;
