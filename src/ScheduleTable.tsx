import { Box } from "@chakra-ui/react";
import { Schedule } from "./types.ts";
import { useDndContext } from "@dnd-kit/core";
import { ScheduleTableGrid } from "./ScheduleTableGrid.tsx";
import { DraggableSchedule } from "./DraggableSchedule.tsx";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";

export type TimeInfo = { day: string; time: number };

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: TimeInfo) => void;
  onDeleteButtonClick?: (timeInfo: TimeInfo) => void;
}

const ScheduleTable = ({
  tableId,
  schedules,
  onScheduleTimeClick,
  onDeleteButtonClick,
}: Props) => {
  const getColor = (lectureId: string): string => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    return colors[lectures.indexOf(lectureId) % colors.length];
  };

  const dndContext = useDndContext();

  const getActiveTableId = () => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  };

  const activeTableId = getActiveTableId();

  const handleScheduleTimeClick = useAutoCallback(
    (timeInfo: { day: string; time: number }) => {
      onScheduleTimeClick?.(timeInfo);
    }
  );

  const handleDeleteButtonClick = useAutoCallback(
    (day: string, time: number) => {
      onDeleteButtonClick?.({
        day,
        time,
      });
    }
  );

  return (
    <Box
      position="relative"
      outline={activeTableId === tableId ? "5px dashed" : undefined}
      outlineColor="blue.300"
    >
      <ScheduleTableGrid onScheduleTimeClick={handleScheduleTimeClick} />
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
};

export default ScheduleTable;
