import { useCallback, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAutoCallback = <T extends (...args: any[]) => any>(callback: T) => {
  const ref = useRef<T>(callback);
  ref.current = callback; // 항상 최신 함수 참조 유지
  return useCallback((...args: Parameters<T>) => ref.current(...args) as ReturnType<T>, []);
};
