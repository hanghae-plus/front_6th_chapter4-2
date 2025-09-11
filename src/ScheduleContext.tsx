import React, { PropsWithChildren, useMemo, useState } from 'react';
import dummyScheduleMap from './dummyScheduleMap.ts';
import { useAutoCallback } from './hooks';
import { Schedule, TimeInfo } from './types.ts';

type SchedulesMap = Record<string, Schedule[]>;

type SchedulesData = {
  schedulesMap: SchedulesMap;
};

type ScheduleActions = {
  setSchedulesMap: React.Dispatch<React.SetStateAction<SchedulesMap>>;
  deleteSchedule: (params: TimeInfo & { tableId: string }) => void;
};

const SchedulesDataContext = React.createContext<SchedulesData | null>(null);
const SchedulesActionsContext = React.createContext<ScheduleActions | null>(null);

export const useSchedulesData = () => {
  const context = React.useContext(SchedulesDataContext);

  if (!context) {
    throw new Error('useSchedulesData must be used within SchedulesProvider');
  }

  return context;
};

export const useSchedulesActions = () => {
  const context = React.useContext(SchedulesActionsContext);

  if (!context) {
    throw new Error('useSchedulesActions must be used within SchedulesProvider');
  }

  return context;
};

export const SchedulesProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<SchedulesMap>(dummyScheduleMap);

  const deleteSchedule = useAutoCallback(
    ({ day, time, tableId }: TimeInfo & { tableId: string }) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time)
        ),
      }));
    }
  );

  const actions = useMemo(
    () => ({ setSchedulesMap, deleteSchedule }),
    [setSchedulesMap, deleteSchedule]
  );

  const data = useMemo(() => ({ schedulesMap }), [schedulesMap]);

  return (
    <SchedulesDataContext.Provider value={data}>
      <SchedulesActionsContext.Provider value={actions}>
        {children}
      </SchedulesActionsContext.Provider>
    </SchedulesDataContext.Provider>
  );
};

export const ScheduleProvider = SchedulesProvider;
