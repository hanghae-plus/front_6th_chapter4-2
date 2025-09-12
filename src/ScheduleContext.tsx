import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { Schedule, Lecture } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";
import { parseSchedule } from "./utils.ts";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";

type SchedulesMap = Record<string, Schedule[]>;

interface ScheduleStateContextType {
  schedulesMap: SchedulesMap;
}

interface ScheduleActionsContextType {
  setSchedulesMap: React.Dispatch<React.SetStateAction<SchedulesMap>>;
  addSchedule: (tableId: string, lecture: Lecture) => void;
  addSchedules: (tableId: string, schedules: Schedule[]) => void;
  removeSchedule: (tableId: string, day: string, time: number) => void;
  duplicateScheduleTable: (sourceTableId: string) => string;
  deleteScheduleTable: (tableId: string) => void;
  updateSchedules: (tableId: string, schedules: Schedule[]) => void;
}

const ScheduleStateContext = createContext<ScheduleStateContextType | undefined>(undefined);
const ScheduleActionsContext = createContext<ScheduleActionsContextType | undefined>(undefined);

export const useScheduleState = () => {
  const context = useContext(ScheduleStateContext);
  if (context === undefined) {
    throw new Error('useScheduleState must be used within a ScheduleProvider');
  }
  return context;
};

export const useScheduleActions = () => {
  const context = useContext(ScheduleActionsContext);
  if (context === undefined) {
    throw new Error('useScheduleActions must be used within a ScheduleProvider');
  }
  return context;
};

export const useScheduleContext = () => {
  const state = useScheduleState();
  const actions = useScheduleActions();
  return { ...state, ...actions };
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<SchedulesMap>(dummyScheduleMap);

  const addSchedule = useAutoCallback((tableId: string, lecture: Lecture) => {
    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));

    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...(prev[tableId] ?? []), ...schedules],
    }));
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
      [tableId]: (prev[tableId] ?? []).filter(
        (schedule) => !(schedule.day === day && schedule.range.includes(time))
      ),
    }));
  });

  const duplicateScheduleTable = useAutoCallback((sourceTableId: string): string => {
    const newTableId = `schedule-${Date.now()}`;
    setSchedulesMap((prev) => ({
      ...prev,
      [newTableId]: [...(prev[sourceTableId] ?? [])],
    }));
    return newTableId;
  });

  const deleteScheduleTable = useAutoCallback((tableId: string) => {
    setSchedulesMap((prev) => {
      return Object.fromEntries(Object.entries(prev).filter(([key]) => key !== tableId));
    });
  });

  const updateSchedules = useAutoCallback((tableId: string, schedules: Schedule[]) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: schedules,
    }));
  });

  const stateValue = useMemo<ScheduleStateContextType>(() => ({ schedulesMap }), [schedulesMap]);
  const actionsValue = useMemo<ScheduleActionsContextType>(
    () => ({ setSchedulesMap, addSchedule, addSchedules, removeSchedule, duplicateScheduleTable, deleteScheduleTable, updateSchedules }),
    [addSchedule, addSchedules, removeSchedule, duplicateScheduleTable, deleteScheduleTable, updateSchedules]
  );

  return (
    <ScheduleStateContext.Provider value={stateValue}>
      <ScheduleActionsContext.Provider value={actionsValue}>
        {children}
      </ScheduleActionsContext.Provider>
    </ScheduleStateContext.Provider>
  );
};
