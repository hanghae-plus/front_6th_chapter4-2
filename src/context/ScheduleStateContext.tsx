import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Schedule } from "../types.ts";
import dummyScheduleMap from "../dummyScheduleMap.ts";

interface ScheduleStateContextType {
  schedulesMap: Record<string, Schedule[]>;
}

const ScheduleStateContext = createContext<
  ScheduleStateContextType | undefined
>(undefined);

export const useScheduleState = () => {
  const context = useContext(ScheduleStateContext);
  if (context === undefined) {
    throw new Error(
      "useScheduleState must be used within a ScheduleStateProvider"
    );
  }
  return context;
};

export const ScheduleStateProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const contextValue = React.useMemo(
    () => ({
      schedulesMap,
    }),
    [schedulesMap]
  );

  return (
    <ScheduleStateContext.Provider value={contextValue}>
      <InternalScheduleStateProvider setSchedulesMap={setSchedulesMap}>
        {children}
      </InternalScheduleStateProvider>
    </ScheduleStateContext.Provider>
  );
};

// 내부 Provider - setState 함수만 관리
const InternalScheduleStateContext = createContext<
  React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>> | undefined
>(undefined);

export const useInternalScheduleState = () => {
  const context = useContext(InternalScheduleStateContext);
  if (context === undefined) {
    throw new Error(
      "useInternalScheduleState must be used within a ScheduleStateProvider"
    );
  }
  return context;
};

const InternalScheduleStateProvider = ({
  children,
  setSchedulesMap,
}: PropsWithChildren & {
  setSchedulesMap: React.Dispatch<
    React.SetStateAction<Record<string, Schedule[]>>
  >;
}) => {
  return (
    <InternalScheduleStateContext.Provider value={setSchedulesMap}>
      {children}
    </InternalScheduleStateContext.Provider>
  );
};
