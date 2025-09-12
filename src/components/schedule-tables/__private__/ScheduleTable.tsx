import { Box } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { useCallback } from "react";

import { DraggableSchedule } from "./DraggableSchedule";
import { MemoizedScheduleGrid } from "./ScheduleGrid";
import type { Schedule, TimeInfo } from "../../../types";

type ScheduleTableProps = {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: TimeInfo) => void;
  onDeleteButtonClick?: (timeInfo: TimeInfo) => void;
};

export function ScheduleTable({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: ScheduleTableProps) {
  const dndContext = useDndContext();

  const getColor = (lectureId: string) => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];

    return colors[lectures.indexOf(lectureId) % colors.length];
  };

  const getActiveTableId = () => {
    const activeId = dndContext.active?.id;
    return activeId ? String(activeId).split(":")[0] : null;
  };

  const handleScheduleTimeClick = useCallback(
    (timeInfo: TimeInfo) => {
      if (onScheduleTimeClick) {
        onScheduleTimeClick(timeInfo);
      }
    },
    [onScheduleTimeClick],
  );

  const activeTableId = getActiveTableId();

  return (
    <Box position="relative" outline={activeTableId === tableId ? "5px dashed" : undefined} outlineColor="blue.300">
      <MemoizedScheduleGrid onScheduleTimeClick={handleScheduleTimeClick} />

      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedule.lecture.id)}
          onDeleteButtonClick={() =>
            onDeleteButtonClick?.({
              day: schedule.day,
              time: schedule.range[0],
            })
          }
        />
      ))}
    </Box>
  );
}
