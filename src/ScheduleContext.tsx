import React, { createContext, PropsWithChildren, useContext, useState, useCallback, useMemo } from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

// 데이터 전용 Context
const SchedulesDataContext = createContext<Record<string, Schedule[]> | undefined>(undefined);

// 액션 전용 Context
interface ScheduleActionsType {
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
  duplicate: (targetId: string) => void;
  remove: (targetId: string) => void;
}

const SchedulesActionsContext = createContext<ScheduleActionsType | undefined>(undefined);

// 데이터 Context Hook
export const useSchedulesData = () => {
  const context = useContext(SchedulesDataContext);
  if (context === undefined) {
    throw new Error('useSchedulesData must be used within a ScheduleProvider');
  }
  return context;
};

// 액션 Context Hook
export const useSchedulesActions = () => {
  const context = useContext(SchedulesActionsContext);
  if (context === undefined) {
    throw new Error('useSchedulesActions must be used within a ScheduleProvider');
  }
  return context;
};

// 기존 호환성을 위한 Hook (점진적 마이그레이션용)
export const useScheduleContext = () => {
  const schedulesMap = useSchedulesData();
  const { setSchedulesMap } = useSchedulesActions();
  return { schedulesMap, setSchedulesMap };
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  // 액션들을 useCallback으로 메모이제이션
  const duplicate = useCallback((targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]]
    }));
  }, []);

  const remove = useCallback((targetId: string) => {
    setSchedulesMap(prev => {
      const newMap = { ...prev };
      delete newMap[targetId];
      return newMap;
    });
  }, []);

  // 액션들을 useMemo로 메모이제이션
  const actions = useMemo(() => ({
    setSchedulesMap,
    duplicate,
    remove
  }), [duplicate, remove]);

  return (
    <SchedulesDataContext.Provider value={schedulesMap}>
      <SchedulesActionsContext.Provider value={actions}>
        {children}
      </SchedulesActionsContext.Provider>
    </SchedulesDataContext.Provider>
  );
};
