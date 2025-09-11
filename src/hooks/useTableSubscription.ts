import { useState, useEffect } from "react";
import { Schedule } from "../types.ts";
import { useScheduleContext } from "../ScheduleContext.tsx";

/**
 * 특정 테이블의 스케줄만 구독하는 커스텀 훅
 * 해당 테이블의 스케줄이 변경될 때만 리렌더링됨
 */
export const useTableSubscription = (tableId: string) => {
  const { subscribeToTable, getTableSchedules } = useScheduleContext();
  const [schedules, setSchedules] = useState<Schedule[]>(() =>
    getTableSchedules(tableId)
  );

  useEffect(() => {
    // 구독 설정
    const unsubscribe = subscribeToTable(tableId, (newSchedules) => {
      setSchedules(newSchedules);
    });

    // 초기값 설정
    setSchedules(getTableSchedules(tableId));

    // 구독 해제
    return unsubscribe;
  }, [tableId, subscribeToTable, getTableSchedules]);

  return schedules;
};
