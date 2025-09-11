import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<
    React.SetStateAction<Record<string, Schedule[]>>
  >;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  // 상태 업데이트 함수를 useCallback으로 메모이제이션
  const memoizedSetSchedulesMap = useCallback(
    (updater: React.SetStateAction<Record<string, Schedule[]>>) => {
      setSchedulesMap(updater);
    },
    []
  );

  return (
    <ScheduleContext.Provider
      value={{ schedulesMap, setSchedulesMap: memoizedSetSchedulesMap }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
