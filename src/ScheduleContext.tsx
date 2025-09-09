import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

// ValueContext 타입
const ScheduleValueContext = createContext<
  Record<string, Schedule[]> | undefined
>(undefined);
// SetterContext 타입
const ScheduleSetterContext = createContext<
  React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>> | undefined
>(undefined);

export const useScheduleValue = () => {
  const context = useContext(ScheduleValueContext);
  if (context === undefined) {
    throw new Error("useScheduleValue must be used within a ScheduleProvider");
  }
  return context;
};

export const useScheduleSetter = () => {
  const context = useContext(ScheduleSetterContext);
  if (context === undefined) {
    throw new Error("useScheduleSetter must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  return (
    <ScheduleValueContext.Provider value={schedulesMap}>
      <ScheduleSetterContext.Provider value={setSchedulesMap}>
        {children}
      </ScheduleSetterContext.Provider>
    </ScheduleValueContext.Provider>
  );
};
