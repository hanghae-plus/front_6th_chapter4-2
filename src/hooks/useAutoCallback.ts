import { useCallback, useRef } from "react";

import type { AnyFunction } from "../types";

export const useAutoCallback = <T extends AnyFunction>(fn: T) => {
  const callbackRef = useRef(fn);

  callbackRef.current = fn;

  const memoCallback = useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []);

  return memoCallback;
};
