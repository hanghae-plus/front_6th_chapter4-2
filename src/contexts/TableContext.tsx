import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
  useMemo,
} from "react";
import { Schedule } from "../types.ts";

interface TableContextType {
  schedules: Schedule[];
  updateSchedules: (schedules: Schedule[]) => void;
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (index: number) => void;
  updateSchedule: (index: number, schedule: Schedule) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};

interface TableProviderProps {
  tableId: string;
  initialSchedules?: Schedule[];
}

export const TableProvider = ({
  children,
  initialSchedules = [],
}: PropsWithChildren<TableProviderProps>) => {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);

  // 스케줄 업데이트 함수들
  const updateSchedules = useCallback((newSchedules: Schedule[]) => {
    setSchedules(newSchedules);
  }, []);

  const addSchedule = useCallback((schedule: Schedule) => {
    setSchedules((prevSchedules) => [...prevSchedules, schedule]);
  }, []);

  const removeSchedule = useCallback((index: number) => {
    setSchedules((prevSchedules) =>
      prevSchedules.filter((_, i) => i !== index)
    );
  }, []);

  const updateSchedule = useCallback((index: number, schedule: Schedule) => {
    setSchedules((prevSchedules) => {
      const newSchedules = [...prevSchedules];
      newSchedules[index] = schedule;
      return newSchedules;
    });
  }, []);

  // Context value 메모이제이션
  const contextValue = useMemo(
    () => ({
      schedules,
      updateSchedules,
      addSchedule,
      removeSchedule,
      updateSchedule,
    }),
    [schedules, updateSchedules, addSchedule, removeSchedule, updateSchedule]
  );

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};
