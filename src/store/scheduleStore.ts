import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Schedule } from "../types";
import dummyScheduleMap from "../dummyScheduleMap";

interface ScheduleStore {
  // 스케줄 데이터
  schedulesMap: Record<string, Schedule[]>;

  // 액션들
  setSchedulesMap: (schedulesMap: Record<string, Schedule[]>) => void;
  updateSchedule: (
    tableId: string,
    index: number,
    updatedSchedule: Schedule
  ) => void;
  addSchedulesToTable: (tableId: string, schedules: Schedule[]) => void;
  removeScheduleFromTable: (tableId: string, day: string, time: number) => void;
  duplicateTable: (sourceTableId: string) => void;
  removeTable: (tableId: string) => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  // 스케줄 데이터
  schedulesMap: dummyScheduleMap,

  // 스케줄 데이터 setter
  setSchedulesMap: (schedulesMap) => set({ schedulesMap }),

  // 스케줄 데이터 update
  updateSchedule: (tableId, index, updatedSchedule) => {
    set((state) => ({
      schedulesMap: {
        ...state.schedulesMap,
        [tableId]: state.schedulesMap[tableId].map((schedule, i) =>
          i === index ? updatedSchedule : schedule
        ),
      },
    }));
  },

  // 스케줄 데이터 add
  addSchedulesToTable: (tableId, schedules) => {
    set((state) => ({
      schedulesMap: {
        ...state.schedulesMap,
        [tableId]: [...(state.schedulesMap[tableId] || []), ...schedules],
      },
    }));
  },

  // 스케줄 데이터 remove
  removeScheduleFromTable: (tableId, day, time) => {
    set((state) => ({
      schedulesMap: {
        ...state.schedulesMap,
        [tableId]: state.schedulesMap[tableId].filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time)
        ),
      },
    }));
  },

  // 스케줄 복제
  duplicateTable: (sourceTableId) => {
    set((state) => {
      const sourceSchedules = state.schedulesMap[sourceTableId] || [];
      // 기존 테이블 수를 기반으로 새로운 ID 생성
      const existingTableCount = Object.keys(state.schedulesMap).length;
      const newTableId = `schedule-${existingTableCount + 1}`;
      return {
        schedulesMap: {
          ...state.schedulesMap,
          [newTableId]: [...sourceSchedules],
        },
      };
    });
  },

  // 스케줄 테이블 삭제
  removeTable: (tableId) => {
    set((state) => {
      const newSchedulesMap = { ...state.schedulesMap };
      delete newSchedulesMap[tableId];
      return { schedulesMap: newSchedulesMap };
    });
  },
}));

export const useSchedulesByTableId = (tableId: string) => {
  return useScheduleStore(
    useShallow((state) => state.schedulesMap[tableId] || [])
  );
};

export const useAllTableIds = () => {
  return useScheduleStore(
    useShallow((state) => Object.keys(state.schedulesMap))
  );
};

export const useSchedulesMap = () => {
  return useScheduleStore((state) => state.schedulesMap);
};
