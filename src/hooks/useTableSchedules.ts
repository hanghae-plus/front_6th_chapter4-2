import { useCallback } from "react";
import { Schedule } from "../types.ts";
import { useScheduleContext } from "../ScheduleContext.tsx";
import { useTableSubscription } from "./useTableSubscription.ts";

/**
 * 특정 테이블의 스케줄만 구독하는 커스텀 훅
 * 해당 테이블의 스케줄이 변경될 때만 리렌더링됨
 */
export const useTableSchedules = (tableId: string) => {
  const { updateTableSchedules } = useScheduleContext();

  // 선택적 구독으로 해당 테이블의 스케줄만 구독
  const schedules = useTableSubscription(tableId);

  const updateSchedules = useCallback(
    (newSchedules: Schedule[]) => {
      updateTableSchedules(tableId, newSchedules);
    },
    [tableId, updateTableSchedules]
  );

  return {
    schedules,
    updateSchedules,
  };
};
