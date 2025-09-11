import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { Schedule } from './types';
import dummyScheduleMap from './dummyScheduleMap';
import { scheduleReducer } from './reducers/scheduleReducer';
import {
  ScheduleActionsReturn,
  useScheduleActions,
} from './hooks/useScheduleActions';

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  actions: ScheduleActionsReturn;
  // 레거시 지원을 위한 setter (점진적 마이그레이션용)
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
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, dispatch] = useReducer(
    scheduleReducer,
    dummyScheduleMap
  );
  const actions = useScheduleActions(dispatch);

  // 레거시 지원을 위한 setter
  const setSchedulesMap = (
    update: React.SetStateAction<Record<string, Schedule[]>>
  ) => {
    if (typeof update === 'function') {
      const newMap = update(schedulesMap);
      dispatch({ type: 'SET_SCHEDULES_MAP', schedulesMap: newMap });
    } else {
      dispatch({ type: 'SET_SCHEDULES_MAP', schedulesMap: update });
    }
  };

  const contextValue = useMemo(
    () => ({
      schedulesMap,
      actions,
      setSchedulesMap,
    }),
    [schedulesMap, actions, setSchedulesMap]
  );

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
};
