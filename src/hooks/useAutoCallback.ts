import { useCallback, useRef } from "react";
import { AnyFunction } from "../types";

export const useAutoCallback = <T extends AnyFunction>(callback: T): T => {
  const ref = useRef(callback);
  ref.current = callback;

  const fn = useCallback((...args: Parameters<T>) => ref.current(...args), []);

  return fn as T;
};
