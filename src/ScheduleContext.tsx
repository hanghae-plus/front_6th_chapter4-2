import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

type SchedulesState = Record<string, Schedule[]>;
type SchedulesDispatch = React.Dispatch<React.SetStateAction<SchedulesState>>;

const SchedulesStateContext = createContext<SchedulesState | undefined>(
  undefined
);
const SchedulesDispatchContext = createContext<SchedulesDispatch | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useSchedulesState = () => {
  const ctx = useContext(SchedulesStateContext);
  if (ctx === undefined) {
    throw new Error("useSchedulesState must be used within a ScheduleProvider");
  }
  return ctx;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSchedulesDispatch = () => {
  const ctx = useContext(SchedulesDispatchContext);
  if (ctx === undefined) {
    throw new Error(
      "useSchedulesDispatch must be used within a ScheduleProvider"
    );
  }
  return ctx;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<SchedulesState>(dummyScheduleMap);

  return (
    <SchedulesStateContext.Provider value={schedulesMap}>
      <SchedulesDispatchContext.Provider value={setSchedulesMap}>
        {children}
      </SchedulesDispatchContext.Provider>
    </SchedulesStateContext.Provider>
  );
};
