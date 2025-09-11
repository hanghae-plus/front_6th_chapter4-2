import { useCallback, useRef } from "react";

export const useAutoCallback = <T extends (...args: unknown[]) => unknown>(callback: T) => {
  const ref = useRef<T>(callback);
  return useCallback((...args: Parameters<T>) => ref.current(...args) as ReturnType<T>, []);
};
