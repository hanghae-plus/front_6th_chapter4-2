import { Schedule, TimeInfo } from '../types';
import { DAY_LABELS } from '../constants';

export type ScheduleAction =
  | {
      type: 'UPDATE_SCHEDULE';
      tableId: string;
      scheduleIndex: number;
      schedule: Schedule;
    }
  | {
      type: 'MOVE_SCHEDULE'; // ✅ 새로운 액션 추가
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

    // ✅ 새로운 케이스: 상대적 이동 처리
    case 'MOVE_SCHEDULE': {
      const { tableId, scheduleIndex, moveDayIndex, moveTimeIndex } = action;

      const currentSchedule = state[tableId]?.[scheduleIndex];
      if (!currentSchedule) {
        console.warn(
          `Schedule not found: tableId=${tableId}, index=${scheduleIndex}`
        );
        return state;
      }

      // 현재 요일 인덱스 계산
      const currentDayIndex = DAY_LABELS.indexOf(
        currentSchedule.day as (typeof DAY_LABELS)[number]
      );

      // 새로운 위치 계산
      const newDayIndex = currentDayIndex + moveDayIndex;
      const newDay = DAY_LABELS[newDayIndex];

      // 경계 체크
      if (newDayIndex < 0 || newDayIndex >= DAY_LABELS.length) {
        return state;
      }

      // 업데이트된 스케줄 생성
      const updatedSchedule = {
        ...currentSchedule,
        day: newDay,
        range: currentSchedule.range.map((time) => time + moveTimeIndex),
      };

      // 시간 범위 유효성 검사
      const minTime = Math.min(...updatedSchedule.range);
      const maxTime = Math.max(...updatedSchedule.range);
      if (minTime < 1 || maxTime > 24) {
        return state;
      }

      // ✅ 해당 테이블만 업데이트
      return {
        ...state,
        [tableId]: state[tableId].map((s, index) =>
          index === scheduleIndex ? updatedSchedule : s
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
