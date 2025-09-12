import { Box } from "@chakra-ui/react";
import { Schedule } from "../../types";
import { useDndContext } from "@dnd-kit/core";
import { memo, useMemo } from "react";
import { useAutoCallback } from "../../hooks";
import { useSchedulesActions } from "../../contexts";
import { DraggableSchedule } from "./DraggableSchedule";
import { ScheduleTableGrid } from "./ScheduleTableGrid";

interface Props {
  tableId: string;
  schedules: Schedule[];
  setSearchInfo: (
    searchInfo: { tableId: string; day?: string; time?: number } | null
  ) => void;
}

export const ScheduleTable = memo(
  ({ tableId, schedules, setSearchInfo }: Props) => {
    const { deleteSchedule } = useSchedulesActions();
    const dndContext = useDndContext();

    const activeTableId = useMemo(() => {
      const activeId = dndContext.active?.id;
      if (activeId) {
        return String(activeId).split(":")[0];
      }
      return null;
    }, [dndContext]);

    const colorMap = useMemo(() => {
      const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
      const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
      return lectures.reduce((acc, lectureId, index) => {
        acc[lectureId] = colors[index % colors.length];
        return acc;
      }, {} as Record<string, string>);
    }, [schedules]);

    const handleDeleteButtonClick = useAutoCallback(
      ({ day, time }: { day: string; time: number }) => {
        deleteSchedule({ tableId, day, time });
      }
    );

    const handleScheduleTimeClick = useAutoCallback(
      (timeInfo: { day: string; time: number }) => {
        setSearchInfo({ tableId, ...timeInfo });
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
            key={`${tableId}-${schedule.lecture.id}-${schedule.day}-${schedule.range[0]}`}
            id={`${tableId}:${index}`}
            day={schedule.day}
            range={schedule.range}
            room={schedule.room}
            lectureTitle={schedule.lecture.title}
            bg={colorMap[schedule.lecture.id]}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
      </Box>
    );
  }
);

ScheduleTable.displayName = "ScheduleTable";
