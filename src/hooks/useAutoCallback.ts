import { useCallback, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

export const useAutoCallback = <T extends AnyFunction>(fn: T): T => {
  const lastFnRef = useRef(fn);
  //콜백함수가 참조하는 값은 항상 렌더링 시점에 최신화 되어야 한다. ← 이 부분을 어떻게 해결할 수 있을지 고민해보세요!
  lastFnRef.current = fn;

  return useCallback((...arg: Parameters<T>) => {
    return lastFnRef.current ? lastFnRef.current(...arg) : null;
  }, []) as T;
};
