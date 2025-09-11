import { useCallback } from 'react';
import { Schedule, TimeInfo } from '../types';
import { ScheduleAction } from '../reducers/scheduleReducer';

export interface ScheduleActionsReturn {
  updateSchedule: (
    tableId: string,
    scheduleIndex: number,
    schedule: Schedule
  ) => void;
  addSchedules: (tableId: string, schedules: Schedule[]) => void;
  deleteSchedule: (tableId: string, timeInfo: TimeInfo) => void;
  duplicateTable: (sourceTableId: string) => void;
  deleteTable: (tableId: string) => void;
  setSchedulesMap: (schedulesMap: Record<string, Schedule[]>) => void;
}

export const useScheduleActions = (
  dispatch: React.Dispatch<ScheduleAction>
): ScheduleActionsReturn => {
  const updateSchedule = useCallback(
    (tableId: string, scheduleIndex: number, schedule: Schedule) => {
      dispatch({ type: 'UPDATE_SCHEDULE', tableId, scheduleIndex, schedule });
    },
    [dispatch]
  );

  const addSchedules = useCallback(
    (tableId: string, schedules: Schedule[]) => {
      dispatch({ type: 'ADD_SCHEDULES', tableId, schedules });
    },
    [dispatch]
  );

  const deleteSchedule = useCallback(
    (tableId: string, timeInfo: TimeInfo) => {
      dispatch({ type: 'DELETE_SCHEDULE', tableId, timeInfo });
    },
    [dispatch]
  );

  const duplicateTable = useCallback(
    (sourceTableId: string) => {
      const newTableId = `schedule-${Date.now()}`;
      dispatch({ type: 'DUPLICATE_TABLE', sourceTableId, newTableId });
    },
    [dispatch]
  );

  const deleteTable = useCallback(
    (tableId: string) => {
      dispatch({ type: 'DELETE_TABLE', tableId });
    },
    [dispatch]
  );

  const setSchedulesMap = useCallback(
    (schedulesMap: Record<string, Schedule[]>) => {
      dispatch({ type: 'SET_SCHEDULES_MAP', schedulesMap });
    },
    [dispatch]
  );

  return {
    updateSchedule,
    addSchedules,
    deleteSchedule,
    duplicateTable,
    deleteTable,
    setSchedulesMap,
  };
};
