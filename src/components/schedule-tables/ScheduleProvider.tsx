/* eslint-disable react-refresh/only-export-components */
import React, { createContext, PropsWithChildren, useContext, useState } from "react";
import dummyScheduleMap from "./dummyScheduleMap";
import { Schedule } from "../../types";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
}

const ScheduleQueryContext = createContext<ScheduleContextType["schedulesMap"] | undefined>(undefined);
const ScheduleCommandContext = createContext<ScheduleContextType["setSchedulesMap"] | undefined>(undefined);

export const useScheduleQueryContext = () => {
  const context = useContext(ScheduleQueryContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const useScheduleCommandContext = () => {
  const context = useContext(ScheduleCommandContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(() => dummyScheduleMap);

  return (
    <ScheduleCommandContext.Provider value={setSchedulesMap}>
      <ScheduleQueryContext value={schedulesMap}>{children}</ScheduleQueryContext>
    </ScheduleCommandContext.Provider>
  );
};
