import { useCallback, useMemo } from 'react';
import { useScheduleContext } from '../ScheduleContext';
import { Schedule } from '../types';

export interface TableActionsReturn {
  duplicate: () => void;
  remove: () => void;
  updateTable: (
    updater: ((prev: Schedule[]) => Schedule[]) | Schedule[]
  ) => void;
}

export const useTableActions = (tableId: string): TableActionsReturn => {
  const { actions, schedulesMap } = useScheduleContext();

  const duplicate = useCallback(() => {
    actions.duplicateTable(tableId);
  }, [actions, tableId]);

  const remove = useCallback(() => {
    actions.deleteTable(tableId);
  }, [actions, tableId]);

  const updateTable = useCallback(
    (updater: ((prev: Schedule[]) => Schedule[]) | Schedule[]) => {
      if (typeof updater === 'function') {
        const next = (updater as (prev: Schedule[]) => Schedule[])(
          schedulesMap[tableId] || []
        );
        actions.setSchedulesMap({ ...schedulesMap, [tableId]: next });
      } else {
        actions.setSchedulesMap({ ...schedulesMap, [tableId]: updater });
      }
    },
    [actions, schedulesMap, tableId]
  );

  return useMemo(
    () => ({ duplicate, remove, updateTable }),
    [duplicate, remove, updateTable]
  );
};
