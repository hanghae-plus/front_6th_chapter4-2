import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleActionContextType {
  setSchedulesMap: React.Dispatch<
    React.SetStateAction<Record<string, Schedule[]>>
  >;
  updateTableSchedules: (
    tableId: string,
    updater: (prev: Schedule[]) => Schedule[]
  ) => void;
  addTable: (newTableId: string, schedules: Schedule[]) => void;
  removeTable: (tableId: string) => void;
}
export interface ScheduleStateContextType {
  schedulesMap: Record<string, Schedule[]>;
  tableCount: number;
}
const ScheduleActionContext = createContext<
  ScheduleActionContextType | undefined
>(undefined);
const ScheduleStateContext = createContext<
  ScheduleStateContextType | undefined
>(undefined);

export const useScheduleActionContext = () => {
  const context = useContext(ScheduleActionContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const useScheduleStateContext = () => {
  const context = useContext(ScheduleStateContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const updateTableSchedules = useCallback(
    (tableId: string, updater: (prev: Schedule[]) => Schedule[]) => {
      setSchedulesMap((prev) => {
        const currentSchedules = prev[tableId] || [];
        const newSchedules = updater(currentSchedules);

        if (currentSchedules === newSchedules) {
          return prev;
        }

        if (
          currentSchedules.length === newSchedules.length &&
          currentSchedules.every((schedule, i) => schedule === newSchedules[i])
        ) {
          return prev;
        }

        return { ...prev, [tableId]: newSchedules };
      });
    },
    []
  );

  const addTable = useCallback((newTableId: string, schedules: Schedule[]) => {
    setSchedulesMap((prev) => ({ ...prev, [newTableId]: schedules }));
  }, []);

  const removeTable = useCallback((tableId: string) => {
    setSchedulesMap((prev) => {
      const newMap = { ...prev };
      delete newMap[tableId];
      return newMap;
    });
  }, []);

  const actionValue = useMemo(
    () => ({
      setSchedulesMap,
      updateTableSchedules,
      addTable,
      removeTable,
    }),
    [updateTableSchedules, addTable, removeTable]
  );

  const stateValue = useMemo(
    () => ({
      schedulesMap,
      tableCount: Object.keys(schedulesMap).length,
    }),
    [schedulesMap]
  );

  return (
    <ScheduleActionContext.Provider value={actionValue}>
      <ScheduleStateContext.Provider value={stateValue}>
        {children}
      </ScheduleStateContext.Provider>
    </ScheduleActionContext.Provider>
  );
};
