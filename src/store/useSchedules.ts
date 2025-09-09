import { useSyncExternalStore } from "react";
import { Schedule } from "../types";
import { scheduleStore } from "./schedule.store";

// 특정 tableId에 해당하는 schedule만 구독
export function useSchedule(tableId: string): Schedule[] {
  return useSyncExternalStore(
    (onStoreChange) =>
      scheduleStore.subscribe((changedId) => {
        if (changedId === "*" || changedId === tableId) {
          onStoreChange();
        }
      }),
    () => scheduleStore.getScheduleMap()[tableId] ?? []
  );
}

// setter는 tableId 단위로 업데이트
export function useSetSchedule() {
  return (tableId: string, updater: (prev: Schedule[]) => Schedule[]) => {
    scheduleStore.setTable(tableId, updater);
  };
}
