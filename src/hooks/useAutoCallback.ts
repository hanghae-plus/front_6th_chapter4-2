import { useRef, useCallback } from "react";

type AnyFunction = (...args: any[]) => any;

export const useAutoCallback = (callback: AnyFunction) => {
  const ref = useRef(callback);
  ref.current = callback;

  return useCallback((...args: any[]) => {
    return ref.current(...args);
  }, []);
};
