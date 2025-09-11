import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
  useRef,
  useMemo,
} from "react";
import { Schedule } from "../types.ts";
import dummyScheduleMap from "../dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<
    React.SetStateAction<Record<string, Schedule[]>>
  >;
  // 개별 테이블 상태 관리 함수들
  getTableSchedules: (tableId: string) => Schedule[];
  updateTableSchedules: (tableId: string, schedules: Schedule[]) => void;
  // 선택적 구독을 위한 함수들
  subscribeToTable: (
    tableId: string,
    callback: (schedules: Schedule[]) => void
  ) => () => void;
  getTableKeys: () => string[];
  // 테이블 키 변경 구독
  subscribeToTableKeys: (callback: (keys: string[]) => void) => () => void;
}

export const ScheduleContext = createContext<ScheduleContextType | undefined>(
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

  // 구독자들을 관리하는 ref
  const subscribersRef = useRef<
    Map<string, Set<(schedules: Schedule[]) => void>>
  >(new Map());

  // 상태 업데이트 함수를 useCallback으로 메모이제이션
  const memoizedSetSchedulesMap = useCallback(
    (updater: React.SetStateAction<Record<string, Schedule[]>>) => {
      setSchedulesMap(updater);
    },
    []
  );

  // 개별 테이블 스케줄 조회 함수 - ref를 사용하여 의존성 제거
  const schedulesMapRef = useRef(schedulesMap);
  schedulesMapRef.current = schedulesMap;

  const getTableSchedules = useCallback(
    (tableId: string) => {
      return schedulesMapRef.current[tableId] || [];
    },
    [] // ref를 사용하여 의존성 제거
  );

  // 개별 테이블 스케줄 업데이트 함수 - 최적화된 업데이트
  const updateTableSchedules = useCallback(
    (tableId: string, schedules: Schedule[]) => {
      setSchedulesMap((prevSchedulesMap) => {
        // 해당 테이블만 변경하고 나머지는 참조 유지
        if (prevSchedulesMap[tableId] === schedules) {
          return prevSchedulesMap; // 변경사항이 없으면 기존 상태 반환
        }

        const newSchedulesMap = {
          ...prevSchedulesMap,
          [tableId]: schedules,
        };

        // 해당 테이블의 구독자들에게만 알림
        const subscribers = subscribersRef.current.get(tableId);
        if (subscribers) {
          subscribers.forEach((callback) => callback(schedules));
        }

        return newSchedulesMap;
      });
    },
    []
  );

  // 선택적 구독 함수
  const subscribeToTable = useCallback(
    (tableId: string, callback: (schedules: Schedule[]) => void) => {
      if (!subscribersRef.current.has(tableId)) {
        subscribersRef.current.set(tableId, new Set());
      }
      subscribersRef.current.get(tableId)!.add(callback);

      // 구독 해제 함수 반환
      return () => {
        const subscribers = subscribersRef.current.get(tableId);
        if (subscribers) {
          subscribers.delete(callback);
          if (subscribers.size === 0) {
            subscribersRef.current.delete(tableId);
          }
        }
      };
    },
    []
  );

  // 테이블 키들 조회 함수 - 의존성 제거
  const getTableKeys = useCallback(() => {
    return Object.keys(schedulesMap);
  }, [schedulesMap]);

  // 테이블 키 변경 구독 함수
  const subscribeToTableKeys = useCallback(
    (callback: (keys: string[]) => void) => {
      const keyCallback = () => {
        callback(Object.keys(schedulesMap));
      };

      // 모든 테이블의 구독자들에게 키 변경 알림
      subscribersRef.current.forEach((subscribers) => {
        subscribers.add(keyCallback);
      });

      // 구독 해제 함수 반환
      return () => {
        subscribersRef.current.forEach((subscribers) => {
          subscribers.delete(keyCallback);
        });
      };
    },
    [schedulesMap]
  );

  // Context value를 메모이제이션하여 불필요한 리렌더링 방지
  const contextValue = useMemo(
    () => ({
      schedulesMap,
      setSchedulesMap: memoizedSetSchedulesMap,
      getTableSchedules,
      updateTableSchedules,
      subscribeToTable,
      getTableKeys,
      subscribeToTableKeys,
    }),
    [
      schedulesMap,
      memoizedSetSchedulesMap,
      getTableSchedules,
      updateTableSchedules,
      subscribeToTable,
      getTableKeys,
      subscribeToTableKeys,
    ]
  );

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
};
