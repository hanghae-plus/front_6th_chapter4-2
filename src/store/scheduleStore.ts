import { create } from "zustand";
import { Schedule } from "../types";
import dummyScheduleMap from "../data/dummySchedules.ts";

export interface ScheduleState {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
  duplicateTable: (targetId: string) => void;
  removeTable: (targetId: string) => void;
  deleteScheduleItem: (tableId: string, day: string, time: number) => void;
  moveScheduleItem: (source: any, destination: any) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedulesMap: dummyScheduleMap,

  setSchedulesMap: (updater) =>
    set((state) => ({
      schedulesMap: typeof updater === "function" ? updater(state.schedulesMap) : updater,
    })),

  duplicateTable: (targetId) =>
    set((state) => ({
      schedulesMap: {
        ...state.schedulesMap,
        [`schedule-${Date.now()}`]: [...state.schedulesMap[targetId]],
      },
    })),

  removeTable: (targetId) =>
    set((state) => {
      const newMap = { ...state.schedulesMap };
      delete newMap[targetId];
      return { schedulesMap: newMap };
    }),

  deleteScheduleItem: (tableId, day, time) =>
    set((state) => ({
      schedulesMap: {
        ...state.schedulesMap,
        [tableId]: state.schedulesMap[tableId].filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time)
        ),
      },
    })),

  moveScheduleItem: (active, over) =>
    set((state) => {
      const [sourceTableId, sourceIndexStr] = String(active.id).split(":");
      const sourceIndex = parseInt(sourceIndexStr, 10);

      const [targetTableId, day, timeStr] = String(over.id).split(":");
      const time = parseInt(timeStr, 10);

      const newMap = JSON.parse(JSON.stringify(state.schedulesMap));

      const sourceItem = newMap[sourceTableId].splice(sourceIndex, 1)[0];

      const newRange = sourceItem.range.map((r: number) => r - sourceItem.range[0] + time);
      const movedItem = { ...sourceItem, day, range: newRange };

      if (!newMap[targetTableId]) {
        newMap[targetTableId] = [];
      }
      newMap[targetTableId].push(movedItem);

      return { schedulesMap: newMap };
    }),
}));
