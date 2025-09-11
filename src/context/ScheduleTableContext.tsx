/* eslint-disable react-refresh/only-export-components */
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import dummyScheduleMap from '../dummyScheduleMap.ts';
import { Schedule } from '../types.ts';

interface TableContextType {
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  updateSchedule: (index: number, schedule: Partial<Schedule>) => void;
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (index: number) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const useScheduleTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within ScheduleTableProvider');
  }
  return context;
};

// 개별 테이블 Provider
export const ScheduleTableProvider = ({
  tableId,
  children,
}: PropsWithChildren<{ tableId: string }>) => {
  const [schedules, setSchedules] = useState<Schedule[]>(
    (dummyScheduleMap as Record<string, Schedule[]>)[tableId] || []
  );
  console.log('scheduleTableContext render:', tableId, schedules.length);

  const updateSchedule = useCallback((index: number, schedule: Partial<Schedule>) => {
    setSchedules(prev => {
      const currentSchedule = prev[index];

      // 깊은 비교로 실제 변경 확인
      const hasChanges = Object.keys(schedule).some(key => {
        const currentValue = currentSchedule[key as keyof Schedule];
        const newValue = schedule[key as keyof Schedule];

        // 배열의 경우 깊은 비교
        if (Array.isArray(currentValue) && Array.isArray(newValue)) {
          return JSON.stringify(currentValue) !== JSON.stringify(newValue);
        }

        return currentValue !== newValue;
      });

      if (!hasChanges) {
        console.log('No changes detected, skipping update');
        return prev; // 동일한 배열 참조 반환
      }

      console.log('Schedule updated:', index, schedule);

      // 변경된 항목만 새 객체로 생성
      const newSchedules = prev.map(
        (s, i) => (i === index ? { ...s, ...schedule } : s) // 변경되지 않은 것은 기존 참조 유지
      );

      return newSchedules;
    });
  }, []);

  const addSchedule = useCallback((schedule: Schedule) => {
    setSchedules(prev => [...prev, schedule]);
  }, []);

  const removeSchedule = useCallback((index: number) => {
    setSchedules(prev => prev.filter((_, i) => i !== index));
  }, []);

  const value = useMemo(
    () => ({
      schedules,
      setSchedules,
      updateSchedule,
      addSchedule,
      removeSchedule,
    }),
    [schedules, setSchedules, updateSchedule, addSchedule, removeSchedule]
  );

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};
