import type React from "react";
import { createContext, type PropsWithChildren, useContext, useState } from "react";
import dummyScheduleMap from "../constants/dummyScheduleMap.ts";
import type { Schedule } from "../types/types.ts";

interface ScheduleContextType {
  tableIds: string[];
  setTableIds: React.Dispatch<React.SetStateAction<string[]>>;
  getInitialSchedules: (tableId: string) => Schedule[];
  addTable: () => string;
  removeTable: (tableId: string) => void;
  duplicateTable: (tableId: string) => string;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [tableIds, setTableIds] = useState<string[]>(Object.keys(dummyScheduleMap));
  const [initialSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const getInitialSchedules = (tableId: string): Schedule[] => {
    return initialSchedulesMap[tableId] || [];
  };

  const addTable = (): string => {
    const newTableId = `schedule-${Date.now()}`;
    setTableIds((prev) => [...prev, newTableId]);
    return newTableId;
  };

  const removeTable = (tableId: string): void => {
    setTableIds((prev) => prev.filter((id) => id !== tableId));
  };

  const duplicateTable = (tableId: string): string => {
    return addTable();
  };

  return (
    <ScheduleContext.Provider
      value={{
        tableIds,
        setTableIds,
        getInitialSchedules,
        addTable,
        removeTable,
        duplicateTable,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
