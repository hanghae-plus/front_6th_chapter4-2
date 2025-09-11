import { createContext, type PropsWithChildren, useContext, useState } from "react";
import type { Schedule } from "../types/types.ts";

interface TableContextType {
  schedules: Schedule[];
  updateSchedules: (schedules: Schedule[]) => void;
  addSchedules: (schedules: Schedule[]) => void;
  removeSchedule: (day: string, time: number) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};

interface TableProviderProps extends PropsWithChildren {
  tableId: string;
  initialSchedules: Schedule[];
}

export const TableProvider = ({ children, initialSchedules }: TableProviderProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);

  const updateSchedules = (newSchedules: Schedule[]) => {
    setSchedules(newSchedules);
  };

  const addSchedules = (newSchedules: Schedule[]) => {
    setSchedules((prev) => [...prev, ...newSchedules]);
  };

  const removeSchedule = (day: string, time: number) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.day !== day || !schedule.range.includes(time)));
  };

  return (
    <TableContext.Provider
      value={{
        schedules,
        updateSchedules,
        addSchedules,
        removeSchedule,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
