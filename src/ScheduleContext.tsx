import {
  createContext,
  PropsWithChildren,
  useContext,
  useSyncExternalStore,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";
import { scheduleStore } from "./store/schedule.store.ts";

// 타입 정의
type ScheduleMap = Record<string, Schedule[]>;

// ValueContext
const ScheduleValueContext = createContext<ScheduleMap | undefined>(undefined);

// SetterContext
const ScheduleSetterContext = createContext<
  ((updater: (prev: ScheduleMap) => ScheduleMap) => void) | undefined
>(undefined);

// Value hook
export const useScheduleValue = () => {
  const context = useContext(ScheduleValueContext);
  if (context === undefined) {
    throw new Error("useScheduleValue must be used within a ScheduleProvider");
  }
  return context;
};

// Setter hook
export const useScheduleSetter = () => {
  const context = useContext(ScheduleSetterContext);
  if (context === undefined) {
    throw new Error("useScheduleSetter must be used within a ScheduleProvider");
  }
  return context;
};

// Provider
export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const schedulesMap = useSyncExternalStore(
    scheduleStore.subscribe,
    scheduleStore.getScheduleMap,
    () => dummyScheduleMap
  );

  return (
    <ScheduleValueContext.Provider value={schedulesMap}>
      <ScheduleSetterContext.Provider value={scheduleStore.setScheduleMap}>
        {children}
      </ScheduleSetterContext.Provider>
    </ScheduleValueContext.Provider>
  );
};
