/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import dummyScheduleMap from '../dummyScheduleMap.ts';
import { Schedule } from '../types.ts';

interface ScheduleContextType {
  tableIds: string[];
  addTable: (id: string, schedules?: Schedule[]) => void;
  removeTable: (id: string) => void;
  duplicateTable: (sourceId: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useScheduleContext must be used within ScheduleContext');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [tableIds, setTableIds] = useState<string[]>(Object.keys(dummyScheduleMap));

  const addTable = useCallback((id: string) => {
    setTableIds(prev => [...prev, id]);
  }, []);

  const removeTable = useCallback((id: string) => {
    setTableIds(prev => prev.filter(tableId => tableId !== id));
  }, []);

  const duplicateTable = useCallback(() => {
    const newId = `schedule-${Date.now()}`;
    setTableIds(prev => [...prev, newId]);
  }, []);

  const value = useMemo(
    () => ({
      tableIds,
      addTable,
      removeTable,
      duplicateTable,
    }),
    [tableIds, addTable, removeTable, duplicateTable]
  );

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};
