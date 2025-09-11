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

  const updateSchedule = useCallback((index: number, schedule: Partial<Schedule>) => {
    setSchedules(prev => prev.map((s, i) => (i === index ? { ...s, ...schedule } : s)));
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
