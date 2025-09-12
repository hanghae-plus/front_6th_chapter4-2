import { useCallback, useRef } from "react";

export const useAutoCallback = <T extends unknown[], R>(
  callback: (...args: T) => R
) => {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback((...args: T) => ref.current(...args), []);
};
