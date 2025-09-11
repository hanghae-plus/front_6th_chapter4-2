import { Box } from '@chakra-ui/react';
import { useDndContext } from '@dnd-kit/core';
import { memo } from 'react';
import { useAutoCallback } from '../../hooks/useAutoCallback';
import { Schedule } from '../../types';
import { DraggableSchedule } from './DraggableSchedule';
import { ScheduleTableGrid } from './ScheduleTableGrid';

type TimeInfo = { day: string; time: number };

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
    const getColor = (lectureId: string): string => {
      const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
      const colors = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];
      return colors[lectures.indexOf(lectureId) % colors.length];
    };

    const dndContext = useDndContext();

    const getActiveTableId = () => {
      const activeId = dndContext.active?.id;
      if (activeId) {
        return String(activeId).split(':')[0];
      }
      return null;
    };

    const activeTableId = getActiveTableId();

    const handleScheduleTimeClick = useAutoCallback((timeInfo: TimeInfo) => {
      onScheduleTimeClick?.(timeInfo);
    });

    return (
      <Box
        position='relative'
        outline={activeTableId === tableId ? '5px dashed' : undefined}
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
