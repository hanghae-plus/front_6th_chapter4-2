import { memo, useCallback, useMemo } from 'react';
import { Schedule } from '../../types.ts';
import DraggableSchedule from './DraggableSchedule.tsx';

const ScheduleList = memo(
  ({
    tableId,
    schedules,
    onDeleteButtonClick,
  }: {
    tableId: string;
    schedules: Schedule[];
    onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
  }) => {
    console.log('ScheduleList render:', tableId, schedules.length); // 디버깅용

    // lectures 계산을 여기서만 수행
    const lectures = useMemo(
      () => [...new Set(schedules.map(({ lecture }) => lecture.id))],
      [schedules]
    );

    const getColor = useCallback(
      (lectureId: string): string => {
        const colors = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];
        return colors[lectures.indexOf(lectureId) % colors.length];
      },
      [lectures]
    );

    const handleDeleteButtonClick = useCallback(
      (day: string, time: number) => () => {
        onDeleteButtonClick?.({ day, time });
      },
      [onDeleteButtonClick]
    );

    return (
      <>
        {schedules.map((schedule, index) => (
          <DraggableSchedule
            key={`${tableId}-${index}`} // 안정된 key
            id={`${tableId}:${index}`}
            data={schedule}
            bg={getColor(schedule.lecture.id)}
            onDeleteButtonClick={handleDeleteButtonClick(schedule.day, schedule.range[0])}
          />
        ))}
      </>
    );
  }
);

ScheduleList.displayName = 'ScheduleList';
export default ScheduleList;
