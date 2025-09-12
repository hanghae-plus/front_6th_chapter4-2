import { memo } from 'react';
import { TimeInfo, Schedule } from '../../types';
import { ScheduleActionsReturn } from '../../hooks/useScheduleActions';
import { ScheduleDndProvider } from './ScheduleDndProvider';
import { ScheduleTable } from './ScheduleTable';

interface ScheduleTableContainerProps {
  tableId: string;
  schedules: Schedule[];
  actions: ScheduleActionsReturn;
  onScheduleTimeClick: (timeInfo: TimeInfo) => void;
}

export const ScheduleTableContainer = memo(
  ({
    tableId,
    schedules,
    actions,
    onScheduleTimeClick,
  }: ScheduleTableContainerProps) => {
    return (
      <ScheduleDndProvider actions={actions}>
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
  },
  (prev, next) =>
    prev.tableId === next.tableId &&
    prev.schedules === next.schedules &&
    prev.actions === next.actions &&
    prev.onScheduleTimeClick === next.onScheduleTimeClick
);

ScheduleTableContainer.displayName = 'ScheduleTableContainer';
