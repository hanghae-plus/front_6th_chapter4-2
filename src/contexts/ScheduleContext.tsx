import { createContext, useContext, useMemo, useState } from "react";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";

import { dummyScheduleMap } from "../data";
import { useAutoCallback } from "../hooks";
import type { Lecture, Schedule } from "../types";
import { parseSchedule } from "../utils";

type SchedulesMap = Record<string, Schedule[]>;

interface ScheduleContextType {
  schedulesMap: SchedulesMap;
  setSchedulesMap: Dispatch<SetStateAction<SchedulesMap>>;
  addSchedule: (tableId: string, lecture: Lecture) => void;
  addSchedules: (tableId: string, schedules: Schedule[]) => void;
  removeSchedule: (tableId: string, day: string, time: number) => void;
  duplicateScheduleTable: (sourceTableId: string) => string;
  deleteScheduleTable: (tableId: string) => void;
  updateSchedules: (tableId: string, schedules: Schedule[]) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useScheduleContext must be used within a ScheduleProvider");
  }

  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<SchedulesMap>(dummyScheduleMap);

  const addSchedule = useAutoCallback((tableId: string, lecture: Lecture) => {
    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({ ...schedule, lecture }));
    setSchedulesMap((prev) => ({ ...prev, [tableId]: [...(prev[tableId] ?? []), ...schedules] }));
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
      [tableId]: (prev[tableId] ?? []).filter((schedule) => !(schedule.day === day && schedule.range.includes(time))),
    }));
  });

  const duplicateScheduleTable = useAutoCallback((sourceTableId: string): string => {
    const newTableId = `schedule-${Date.now()}`;
    setSchedulesMap((prev) => ({ ...prev, [newTableId]: [...(prev[sourceTableId] ?? [])] }));
    return newTableId;
  });

  const deleteScheduleTable = useAutoCallback((tableId: string) => {
    setSchedulesMap((prev) => {
      const newSchedulesMap = { ...prev };
      delete newSchedulesMap[tableId];
      return newSchedulesMap;
    });
  });

  const updateSchedules = useAutoCallback((tableId: string, schedules: Schedule[]) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: schedules,
    }));
  });

  const contextValue: ScheduleContextType = useMemo(
    () => ({
      schedulesMap,
      setSchedulesMap,
      addSchedule,
      addSchedules,
      removeSchedule,
      duplicateScheduleTable,
      deleteScheduleTable,
      updateSchedules,
    }),
    [
      addSchedule,
      addSchedules,
      deleteScheduleTable,
      duplicateScheduleTable,
      removeSchedule,
      schedulesMap,
      updateSchedules,
    ],
  );

  return <ScheduleContext.Provider value={contextValue}>{children}</ScheduleContext.Provider>;
};
