import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useCallback,
} from "react";
import { Schedule } from "../types.ts";
import { useInternalScheduleState } from "./ScheduleStateContext.tsx";
import { DAY_LABELS } from "../constants.ts";

interface ScheduleActionsContextType {
  moveSchedule: (
    tableId: string,
    scheduleIndex: number,
    dayDelta: number,
    timeDelta: number
  ) => void;
  deleteSchedule: (tableId: string, day: string, time: number) => void;
  addSchedule: (tableId: string, schedule: Schedule) => void;
}

const ScheduleActionsContext = createContext<
  ScheduleActionsContextType | undefined
>(undefined);

export const useScheduleActions = () => {
  const context = useContext(ScheduleActionsContext);
  if (context === undefined) {
    throw new Error(
      "useScheduleActions must be used within a ScheduleActionsProvider"
    );
  }
  return context;
};

export const ScheduleActionsProvider = ({ children }: PropsWithChildren) => {
  const setSchedulesMap = useInternalScheduleState();

  const moveSchedule = useCallback(
    (
      tableId: string,
      scheduleIndex: number,
      dayDelta: number,
      timeDelta: number
    ) => {
      setSchedulesMap((prevSchedulesMap) => {
        const tableSchedules = prevSchedulesMap[tableId];
        if (!tableSchedules || !tableSchedules[scheduleIndex]) {
          return prevSchedulesMap;
        }

        const schedule = tableSchedules[scheduleIndex];
        const currentDayIndex = DAY_LABELS.indexOf(
          schedule.day as (typeof DAY_LABELS)[number]
        );
        const newDayIndex = currentDayIndex + dayDelta;

        // 유효한 범위 체크
        if (newDayIndex < 0 || newDayIndex >= DAY_LABELS.length) {
          return prevSchedulesMap;
        }

        const newDay = DAY_LABELS[newDayIndex];
        const newRange = schedule.range.map((time) => time + timeDelta);

        // 시간 범위 유효성 체크 (1-24 시간대)
        if (newRange.some((time) => time < 1 || time > 24)) {
          return prevSchedulesMap;
        }

        // 해당 테이블만 업데이트 - 불변성 유지하면서 최소한의 변경
        return {
          ...prevSchedulesMap,
          [tableId]: tableSchedules.map((targetSchedule, index) =>
            index === scheduleIndex
              ? {
                  ...targetSchedule,
                  day: newDay,
                  range: newRange,
                }
              : targetSchedule
          ),
        };
      });
    },
    [setSchedulesMap]
  );

  const deleteSchedule = useCallback(
    (tableId: string, day: string, time: number) => {
      setSchedulesMap((prevSchedulesMap) => {
        const tableSchedules = prevSchedulesMap[tableId];
        if (!tableSchedules) {
          return prevSchedulesMap;
        }

        const updatedSchedules = tableSchedules.filter(
          (schedule) => !(schedule.day === day && schedule.range.includes(time))
        );

        // 실제로 변경이 있을 때만 새 객체 반환
        if (updatedSchedules.length === tableSchedules.length) {
          return prevSchedulesMap;
        }

        return {
          ...prevSchedulesMap,
          [tableId]: updatedSchedules,
        };
      });
    },
    [setSchedulesMap]
  );

  const addSchedule = useCallback(
    (tableId: string, schedule: Schedule) => {
      setSchedulesMap((prevSchedulesMap) => ({
        ...prevSchedulesMap,
        [tableId]: [...(prevSchedulesMap[tableId] || []), schedule],
      }));
    },
    [setSchedulesMap]
  );

  const contextValue = React.useMemo(
    () => ({
      moveSchedule,
      deleteSchedule,
      addSchedule,
    }),
    [moveSchedule, deleteSchedule, addSchedule]
  );

  return (
    <ScheduleActionsContext.Provider value={contextValue}>
      {children}
    </ScheduleActionsContext.Provider>
  );
};
