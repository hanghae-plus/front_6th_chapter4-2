import { useCallback, useMemo } from 'react';
import { Schedule, TimeInfo } from '../types';

export type ScheduleAction =
  | {
      type: 'UPDATE_SCHEDULE';
      tableId: string;
      scheduleIndex: number;
      schedule: Schedule;
    }
  | {
      type: 'MOVE_SCHEDULE';
      tableId: string;
      scheduleIndex: number;
      moveDayIndex: number;
      moveTimeIndex: number;
    }
  | { type: 'ADD_SCHEDULES'; tableId: string; schedules: Schedule[] }
  | { type: 'DELETE_SCHEDULE'; tableId: string; timeInfo: TimeInfo }
  | { type: 'DUPLICATE_TABLE'; sourceTableId: string; newTableId: string }
  | { type: 'DELETE_TABLE'; tableId: string }
  | { type: 'SET_SCHEDULES_MAP'; schedulesMap: Record<string, Schedule[]> };

export interface ScheduleActionsReturn {
  updateSchedule: (
    tableId: string,
    scheduleIndex: number,
    schedule: Schedule
  ) => void;
  moveSchedule: (
    tableId: string,
    scheduleIndex: number,
    moveDayIndex: number,
    moveTimeIndex: number
  ) => void; // ✅ 새로운 액션
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

  // ✅ 새로운 액션 함수
  const moveSchedule = useCallback(
    (
      tableId: string,
      scheduleIndex: number,
      moveDayIndex: number,
      moveTimeIndex: number
    ) => {
      dispatch({
        type: 'MOVE_SCHEDULE',
        tableId,
        scheduleIndex,
        moveDayIndex,
        moveTimeIndex,
      });
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

  return useMemo(
    () => ({
      updateSchedule,
      moveSchedule,
      addSchedules,
      deleteSchedule,
      duplicateTable,
      deleteTable,
      setSchedulesMap,
    }),
    [
      updateSchedule,
      moveSchedule,
      addSchedules,
      deleteSchedule,
      duplicateTable,
      deleteTable,
      setSchedulesMap,
    ]
  );
};
