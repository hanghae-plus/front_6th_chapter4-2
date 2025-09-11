import { Box } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { useScheduleStore } from "../../store/scheduleStore.ts";
import { TimeTableGrid } from "./TimeTableGrid.tsx";
import { DraggableSchedule } from "./DraggableSchedule.tsx";

interface Props {
  tableId: string;
  onScheduleTimeClick: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick: (tableId: string, timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = ({ tableId, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
  const schedules = useScheduleStore((state) => state.schedulesMap[tableId]);

  const lectureColorMap = useMemo(() => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    const colorMap = new Map<string, string>();
    lectures.forEach((lectureId, index) => {
      colorMap.set(lectureId, colors[index % colors.length]);
    });
    return colorMap;
  }, [schedules]);

  return (
    <Box position="relative">
      <TimeTableGrid onScheduleTimeClick={onScheduleTimeClick} />

      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${tableId}:${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={lectureColorMap.get(schedule.lecture.id)}
          onDeleteButtonClick={onDeleteButtonClick}
        />
      ))}
    </Box>
  );
};

export default memo(ScheduleTable);
