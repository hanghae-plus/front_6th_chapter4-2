import { useRef, useEffect, useCallback } from 'react';

export function useAutoCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T
): T {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
  });

  return useCallback((...args: Parameters<T>) => {
    return ref.current(...args);
  }, []) as T;
}
