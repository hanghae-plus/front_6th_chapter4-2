import { useCallback, useRef } from "react";

export type AnyFunction = (...args: any[]) => any;

export const useAutoCallback = <T extends AnyFunction>(fn: T): T => {
  const ref = useRef<T>(fn);
  ref.current = fn;

  const callback = useCallback((...args: Parameters<T>): ReturnType<T> => {
    return ref.current(...args);
  }, []);

  return callback as T;
};
