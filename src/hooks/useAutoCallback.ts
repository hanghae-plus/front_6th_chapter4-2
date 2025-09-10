import { useCallback, useRef } from 'react';

/**
 * 항상 최신 클로저를 참조하면서도 안정된 함수 참조를 제공하는 훅입니다.
 *
 * @param callback - 메모이제이션할 함수
 * @returns 항상 동일한 참조를 가지지만 최신 클로저를 사용하는 함수
 */
export const useAutoCallback = <T extends (...args: any[]) => any>(
  callback: T
) => {
  const ref = useRef(callback); // 1. ref에 함수 저장
  ref.current = callback; // 2. 매 렌더링마다 최신 함수로 업데이트

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return ref.current(...args); // 3. 호출 시 최신 함수 실행
  }, []);
};
