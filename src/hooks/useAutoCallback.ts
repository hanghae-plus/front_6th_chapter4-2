/**
 * 자동으로 최신 콜백을 참조하는 커스텀 훅
 * 의존성 배열 없이도 항상 최신 상태의 콜백 함수를 호출할 수 있게 해줍니다.
 * useCallback의 의존성 배열 관리 부담을 줄여주는 유틸리티 훅입니다.
 */
import { useCallback, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export const useAutoCallback = (callback: AnyFunction) => {
  const ref = useRef(callback);

  ref.current = callback;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useCallback((...args: any[]) => {
    ref.current(...args);
  }, []);
};
