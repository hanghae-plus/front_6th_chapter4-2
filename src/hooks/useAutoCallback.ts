import { useCallback, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = (...args: any[]) => any;

export const useAutoCallback = (callback: Fn) => {
  const ref = useRef(callback);
  ref.current = callback;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useCallback((...args: any[]) => {
    ref.current(...args);
  }, []);
};
