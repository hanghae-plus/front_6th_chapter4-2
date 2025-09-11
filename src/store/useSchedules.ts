import { useSyncExternalStore } from "react";
import { Schedule } from "../types";
import { scheduleStore } from "./schedule.store";
import dummyScheduleMap from "../dummyScheduleMap";

const EMPTY: Schedule[] = [];

// 특정 tableId에 해당하는 schedule만 구독
export function useSchedule(tableId: string): Schedule[] {
  return useSyncExternalStore(
    (onStoreChange) =>
      scheduleStore.subscribe((changedId) => {
        if (changedId === "*" || changedId === tableId) {
          onStoreChange();
        }
      }),
    () => scheduleStore.getScheduleMap()[tableId] ?? EMPTY
  );
}

type ScheduleMap = Record<string, Schedule[]>;
// 시간표 데이터 전체를 구독
export function useSchedulesMap(): ScheduleMap {
  return useSyncExternalStore(
    (onStoreChange) =>
      scheduleStore.subscribe((changedId) => {
        if (changedId === "*") onStoreChange();
      }),
    () => scheduleStore.getScheduleMap(),
    () => dummyScheduleMap
  );
}
