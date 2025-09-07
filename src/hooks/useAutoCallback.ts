import { useCallback, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export const useAutoCallback = (callback: AnyFunction) => {
  const ref = useRef(callback);
  ref.current = callback;

  return useCallback((...args: Parameters<typeof callback>) => {
    return ref.current(...args);
  }, []);
};
