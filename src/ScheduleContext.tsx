import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";

type SchedulesMap = Record<string, Schedule[]>;

interface ScheduleStateContextType {
  schedulesMap: SchedulesMap;
}

interface ScheduleActionsContextType {
  setSchedulesMap: React.Dispatch<React.SetStateAction<SchedulesMap>>;
  duplicate: (tableId: string) => void;
  remove: (tableId: string) => void;
  addSchedules: (tableId: string, schedules: Schedule[]) => void;
  removeSchedule: (tableId: string, day: string, time: number) => void;
  updateSchedules: (tableId: string, schedules: Schedule[]) => void;
}

const ScheduleStateContext = createContext<ScheduleStateContextType | undefined>(undefined);
const ScheduleActionsContext = createContext<ScheduleActionsContextType | undefined>(undefined);

export const useScheduleState = () => {
  const context = useContext(ScheduleStateContext);
  if (context === undefined) {
    throw new Error("useScheduleState must be used within a ScheduleProvider");
  }
  return context;
};

export const useScheduleActions = () => {
  const context = useContext(ScheduleActionsContext);
  if (context === undefined) {
    throw new Error("useScheduleActions must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<SchedulesMap>(dummyScheduleMap);

  const duplicate = useAutoCallback((tableId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      ["schedule-" + Date.now()]: [...(prev[tableId] ?? [])],
    }));
  });

  const remove = useAutoCallback((tableId: string) => {
    setSchedulesMap((prev) => {
      return Object.fromEntries(Object.entries(prev).filter(([key]) => key !== tableId));
    });
  });

  const addSchedules = useAutoCallback((tableId: string, schedules: Schedule[]) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...(prev[tableId] ?? []), ...schedules],
    }));
  });

  const removeSchedule = useAutoCallback((tableId: string, day: string, time: number) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: (prev[tableId] ?? []).filter((s) => s.day !== day || !s.range.includes(time)),
    }));
  });

  const updateSchedules = useAutoCallback((tableId: string, schedules: Schedule[]) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: schedules,
    }));
  });

  const stateValue = useMemo<ScheduleStateContextType>(() => ({ schedulesMap }), [schedulesMap]);
  const actionsValue = useMemo<ScheduleActionsContextType>(
    () => ({ setSchedulesMap, duplicate, remove, addSchedules, removeSchedule, updateSchedules }),
    [duplicate, remove, addSchedules, removeSchedule, updateSchedules]
  );

  return (
    <ScheduleStateContext.Provider value={stateValue}>
      <ScheduleActionsContext.Provider value={actionsValue}>{children}</ScheduleActionsContext.Provider>
    </ScheduleStateContext.Provider>
  );
};
