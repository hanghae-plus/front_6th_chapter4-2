import { useCallback, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export const useAutoCallback = <T extends AnyFunction>(callback: T): T => {
  const ref = useRef(callback);
  ref.current = callback;

  const fn = useCallback((...args: Parameters<T>) => ref.current(...args), []);

  return fn as T;
};
