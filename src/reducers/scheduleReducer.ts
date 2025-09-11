import { Schedule, TimeInfo } from '../types';

export type ScheduleAction =
  | {
      type: 'UPDATE_SCHEDULE';
      tableId: string;
      scheduleIndex: number;
      schedule: Schedule;
    }
  | { type: 'ADD_SCHEDULES'; tableId: string; schedules: Schedule[] }
  | { type: 'DELETE_SCHEDULE'; tableId: string; timeInfo: TimeInfo }
  | { type: 'DUPLICATE_TABLE'; sourceTableId: string; newTableId: string }
  | { type: 'DELETE_TABLE'; tableId: string }
  | { type: 'SET_SCHEDULES_MAP'; schedulesMap: Record<string, Schedule[]> };

export const scheduleReducer = (
  state: Record<string, Schedule[]>,
  action: ScheduleAction
): Record<string, Schedule[]> => {
  switch (action.type) {
    case 'UPDATE_SCHEDULE': {
      const { tableId, scheduleIndex, schedule } = action;
      return {
        ...state,
        [tableId]: state[tableId].map((s, index) =>
          index === scheduleIndex ? schedule : s
        ),
      };
    }

    case 'ADD_SCHEDULES': {
      const { tableId, schedules } = action;
      return {
        ...state,
        [tableId]: [...(state[tableId] || []), ...schedules],
      };
    }

    case 'DELETE_SCHEDULE': {
      const { tableId, timeInfo } = action;
      return {
        ...state,
        [tableId]: state[tableId].filter(
          (schedule) =>
            schedule.day !== timeInfo.day ||
            !schedule.range.includes(timeInfo.time)
        ),
      };
    }

    case 'DUPLICATE_TABLE': {
      const { sourceTableId, newTableId } = action;
      return {
        ...state,
        [newTableId]: [...(state[sourceTableId] || [])],
      };
    }

    case 'DELETE_TABLE': {
      const { tableId } = action;
      const newState = { ...state };
      delete newState[tableId];
      return newState;
    }

    case 'SET_SCHEDULES_MAP': {
      return action.schedulesMap;
    }

    default:
      return state;
  }
};