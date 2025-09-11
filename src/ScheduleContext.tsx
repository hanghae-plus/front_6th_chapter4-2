import { createContext, PropsWithChildren, useContext, useState, useCallback } from 'react';
import { Schedule } from './types.ts';
import dummyScheduleMap from './dummyScheduleMap.ts';

interface ScheduleContextType {
  initialSchedulesMap: Record<string, Schedule[]>;
  tableIds: string[];
  addTable: () => string;
  duplicateTable: (sourceTableId: string, schedules: Schedule[]) => string;
  removeTable: (tableId: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [initialSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);
  const [tableIds, setTableIds] = useState<string[]>(Object.keys(dummyScheduleMap));

  const addTable = useCallback(() => {
    const newId = `schedule-${Date.now()}`;
    setTableIds(prev => [...prev, newId]);
    return newId;
  }, []);

  const duplicateTable = useCallback(() => {
    const newId = `schedule-${Date.now()}`;
    setTableIds(prev => [...prev, newId]);
    return newId;
  }, []);

  const removeTable = useCallback((tableId: string) => {
    setTableIds(prev => prev.filter(id => id !== tableId));
  }, []);

  return (
    <ScheduleContext.Provider
      value={{
        initialSchedulesMap,
        tableIds,
        addTable,
        duplicateTable,
        removeTable,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
