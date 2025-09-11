import { useState, useEffect } from "react";
import { useScheduleContext } from "../contexts/ScheduleContext.tsx";

/**
 * 테이블 키들만 구독하는 커스텀 훅
 * 테이블 추가/삭제 시에만 리렌더링됨
 */
export const useTableKeys = () => {
  const { getTableKeys, subscribeToTableKeys } = useScheduleContext();
  const [tableKeys, setTableKeys] = useState<string[]>(() => getTableKeys());

  useEffect(() => {
    // 테이블 키 변경 구독
    const unsubscribe = subscribeToTableKeys((keys) => {
      setTableKeys(keys);
    });

    // 초기값 설정
    setTableKeys(getTableKeys());

    // 구독 해제
    return unsubscribe;
  }, [getTableKeys, subscribeToTableKeys]);

  return tableKeys;
};
