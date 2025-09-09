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

// SetterContext 타입
type SetterContextType = {
  setTable: (
    tableId: string,
    updater: (prev: Schedule[]) => Schedule[]
  ) => void;
  deleteTable: (tableId: string) => void;
  duplicateTable: (tableId: string) => void;
  deleteScheduleItem: (tableId: string, data: Schedule) => void;
};

// ValueContext
const ScheduleValueContext = createContext<ScheduleMap | undefined>(undefined);

// SetterContext
const ScheduleSetterContext = createContext<SetterContextType | undefined>(
  undefined
);

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
      <ScheduleSetterContext.Provider
        value={{
          setTable: (id, updater) => scheduleStore.setTable(id, updater),
          deleteTable: (id) => scheduleStore.deleteTable(id),
          duplicateTable: (id) => scheduleStore.duplicateTable(id),
          deleteScheduleItem: (id, data) =>
            scheduleStore.deleteScheduleItem(id, data),
        }}
      >
        {children}
      </ScheduleSetterContext.Provider>
    </ScheduleValueContext.Provider>
  );
};
