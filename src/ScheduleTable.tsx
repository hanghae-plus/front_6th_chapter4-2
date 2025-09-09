import { Box, Popover } from "@chakra-ui/react";
import { Schedule } from "./types.ts";
import { ComponentProps, memo, useCallback } from "react";
import { LectureDeletePopover } from "./LectureDeletePopover.tsx";
import { LectureItemPopover } from "./LectureItemPopover.tsx";
import { ScheduleStaticGrid } from "./ScheduleStaticGrid.tsx";

interface ScheduleTableProps {
  tableId: string;
  schedules: Schedule[];
  active: boolean;
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = memo(
  ({ tableId, schedules, active, onScheduleTimeClick }: ScheduleTableProps) => {
    console.log("ScheduleTable rerender!");

    const getColor = useCallback(
      (lectureId: string): string => {
        const lectures = [
          ...new Set(schedules.map(({ lecture }) => lecture.id)),
        ];
        const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
        return colors[lectures.indexOf(lectureId) % colors.length];
      },
      [schedules]
    );

    return (
      <Box
        position="relative"
        outline={active ? "5px dashed" : undefined}
        outlineColor="blue.300"
      >
        <ScheduleStaticGrid onScheduleTimeClick={onScheduleTimeClick} />
        {schedules.map((schedule, index) => (
          <DraggableSchedule
            tableId={tableId}
            key={`${schedule.lecture.title}-${index}`}
            id={`${tableId}:${index}`}
            data={schedule}
            bg={getColor(schedule.lecture.id)}
          />
        ))}
      </Box>
    );
  }
);

const DraggableSchedule = memo(
  ({
    tableId,
    id,
    data,
    bg,
  }: { tableId: string; id: string; data: Schedule } & ComponentProps<
    typeof Box
  >) => {
    return (
      <Popover>
        <LectureItemPopover data={data} bg={bg} id={id} />
        <LectureDeletePopover tableId={tableId} data={data} />
      </Popover>
    );
  }
);

export default ScheduleTable;
