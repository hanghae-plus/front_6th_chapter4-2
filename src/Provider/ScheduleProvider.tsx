import React, { PropsWithChildren, useMemo, useState } from "react";
import dummyScheduleMap from "../dummyScheduleMap.ts";
import { useAutoCallback } from "../hooks/useAutoCallback.ts";
import { Schedule } from "../types.ts";

const ScheduleStateContext = React.createContext<Record<
  string,
  Schedule[]
> | null>(null);

const ScheduleActionsContext = React.createContext<{
  setSchedulesMap: React.Dispatch<
    React.SetStateAction<Record<string, Schedule[]>>
  >;
  onDeleteScheduleButtonClick: (
    tableId: string,
    day: string,
    time: number
  ) => void;
} | null>(null);

export const useScheduleState = () => {
  const ctx = React.useContext(ScheduleStateContext);

  if (!ctx) {
    throw new Error("useScheduleState must be used within ScheduleProvider");
  }

  return ctx;
};
export const useScheduleActions = () => {
  const ctx = React.useContext(ScheduleActionsContext);

  if (!ctx) {
    throw new Error("useScheduleActions must be used within ScheduleProvider");
  }

  return ctx;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const onDeleteScheduleButtonClick = useAutoCallback(
    (tableId: string, day: string, time: number) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (s) => s.day !== day || !s.range.includes(time)
        ),
      }));
    }
  );

  const actions = useMemo(
    () => ({ setSchedulesMap, onDeleteScheduleButtonClick }),
    [setSchedulesMap, onDeleteScheduleButtonClick]
  );

  return (
    <ScheduleActionsContext.Provider value={actions}>
      <ScheduleStateContext.Provider value={schedulesMap}>
        {children}
      </ScheduleStateContext.Provider>
    </ScheduleActionsContext.Provider>
  );
};
