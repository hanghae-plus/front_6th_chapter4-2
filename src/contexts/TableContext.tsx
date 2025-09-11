import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { Schedule } from "../types.ts";

interface TableContextType {
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  updateSchedule: (index: number, schedule: Schedule) => void;
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (index: number) => void;
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

  // 개별 스케줄 업데이트 함수
  const updateSchedule = useCallback((index: number, schedule: Schedule) => {
    setSchedules((prevSchedules) => {
      const newSchedules = [...prevSchedules];
      newSchedules[index] = schedule;
      return newSchedules;
    });
  }, []);

  // 스케줄 추가 함수
  const addSchedule = useCallback((schedule: Schedule) => {
    setSchedules((prevSchedules) => [...prevSchedules, schedule]);
  }, []);

  // 스케줄 삭제 함수
  const removeSchedule = useCallback((index: number) => {
    setSchedules((prevSchedules) =>
      prevSchedules.filter((_, i) => i !== index)
    );
  }, []);

  return (
    <TableContext.Provider
      value={{
        schedules,
        setSchedules,
        updateSchedule,
        addSchedule,
        removeSchedule,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
