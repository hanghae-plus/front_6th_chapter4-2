// ✅ 수정된 src/hooks/useScheduleTable.ts
import { useMemo } from 'react';
import { Schedule } from '../types';

export const useScheduleTable = (
  schedulesMap: Record<string, Schedule[]>,
  tableId: string
): Schedule[] => {
  return useMemo(() => {
    return schedulesMap[tableId] || [];
  }, [schedulesMap[tableId], tableId]); // ✅ 핵심: 해당 테이블만 의존성
};

export const useScheduleTableIds = (
  schedulesMap: Record<string, Schedule[]>
): string[] => {
  return useMemo(() => {
    return Object.keys(schedulesMap);
  }, [schedulesMap]);
};
