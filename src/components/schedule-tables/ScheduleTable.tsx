import { Box } from '@chakra-ui/react';
import { memo, useMemo } from 'react';
import { useAutoCallback } from '../../hooks/useAutoCallback';
import { useScheduleDrag } from '../../hooks/useScheduleDrag';
import { Schedule, TimeInfo } from '../../types';
import { DraggableSchedule } from './DraggableSchedule';
import { ScheduleTableGrid } from './ScheduleTableGrid';

interface ScheduleTableProps {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: TimeInfo) => void;
  onDeleteButtonClick?: (timeInfo: TimeInfo) => void;
}

export const ScheduleTable = memo(
  ({
    tableId,
    schedules,
    onScheduleTimeClick,
    onDeleteButtonClick,
  }: ScheduleTableProps) => {
    const isThisTableDragging = useScheduleDrag(tableId);

    // 색상 매핑을 메모이제이션
    const getColor = useMemo(() => {
      const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
      const colors = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];

      return (lectureId: string): string => {
        return colors[lectures.indexOf(lectureId) % colors.length];
      };
    }, [schedules]);

    const handleScheduleTimeClick = useAutoCallback((timeInfo: TimeInfo) => {
      onScheduleTimeClick?.(timeInfo);
    });

    return (
      <Box
        position='relative'
        outline={isThisTableDragging ? '5px dashed' : undefined}
        outlineColor='blue.300'
      >
        <ScheduleTableGrid onScheduleTimeClick={handleScheduleTimeClick} />
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
);

ScheduleTable.displayName = 'ScheduleTable';
