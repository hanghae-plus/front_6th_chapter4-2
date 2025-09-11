import { useRef, useCallback } from "react";

export const useAutoCallback = (callback: any) => {
  const ref = useRef(callback);

  ref.current = callback;

  return useCallback((...args: any[]) => {
    return ref.current(...args);
  }, []);
};
