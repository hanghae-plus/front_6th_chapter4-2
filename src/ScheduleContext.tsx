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
  updateTable: (tableId: string, updater: (prev: Schedule[]) => Schedule[]) => void;
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
      const copy = { ...prev } as SchedulesMap;
      delete copy[tableId];
      return copy;
    });
  });

  const updateTable = useAutoCallback((tableId: string, updater: (prev: Schedule[]) => Schedule[]) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: updater(prev[tableId] ?? []),
    }));
  });

  const stateValue = useMemo<ScheduleStateContextType>(() => ({ schedulesMap }), [schedulesMap]);
  const actionsValue = useMemo<ScheduleActionsContextType>(
    () => ({ setSchedulesMap, duplicate, remove, updateTable }),
    [duplicate, remove, updateTable]
  );

  return (
    <ScheduleStateContext.Provider value={stateValue}>
      <ScheduleActionsContext.Provider value={actionsValue}>{children}</ScheduleActionsContext.Provider>
    </ScheduleStateContext.Provider>
  );
};
