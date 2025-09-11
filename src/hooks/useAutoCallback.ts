/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from "react";

type AnyFunction = (...args: any[]) => any;

export const useAutoCallback = (callback: AnyFunction) => {
  const ref = useRef(callback);
  ref.current = callback;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args: any[]) => {
    return ref.current?.(...args);
  }, []);
};
