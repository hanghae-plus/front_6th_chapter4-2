import { memo } from 'react';
import { useScheduleContext } from '../../ScheduleContext';
import { useScheduleTable } from '../../hooks/useScheduleTable';
import { TimeInfo } from '../../types';
import { ScheduleDndProvider } from './ScheduleDndProvider';
import { ScheduleTable } from './ScheduleTable';

interface ScheduleTableContainerProps {
  tableId: string;
  onScheduleTimeClick: (timeInfo: TimeInfo) => void;
}

export const ScheduleTableContainer = memo(
  ({ tableId, onScheduleTimeClick }: ScheduleTableContainerProps) => {
    const { schedulesMap, actions } = useScheduleContext();
    const schedules = useScheduleTable(schedulesMap, tableId);

    return (
      <ScheduleDndProvider>
        <ScheduleTable
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={onScheduleTimeClick}
          onDeleteButtonClick={(timeInfo) =>
            actions.deleteSchedule(tableId, timeInfo)
          }
        />
      </ScheduleDndProvider>
    );
  }
);

ScheduleTableContainer.displayName = 'ScheduleTableContainer';
