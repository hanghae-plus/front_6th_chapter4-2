import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import dummyScheduleMap from "./dummyScheduleMap.ts";
import { Schedule } from "./types.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<
    React.SetStateAction<Record<string, Schedule[]>>
  >;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined,
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const useScheduleTable = (tableId: string) => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  
  const schedules = schedulesMap[tableId] || [];
  
  const updateSchedules = (updater: Schedule[] | ((prev: Schedule[]) => Schedule[])) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: typeof updater === 'function' ? updater(prev[tableId] || []) : updater
    }));
  };

  return {
    schedules,
    updateSchedules
  };
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  return (
    <ScheduleContext.Provider value={{ schedulesMap, setSchedulesMap }}>
      {children}
    </ScheduleContext.Provider>
  );
};
