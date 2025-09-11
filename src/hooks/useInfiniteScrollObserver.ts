import { useCallback, useRef, RefObject } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  onLoadMore: () => void;
  root?: Element | null;
  threshold?: number;
}

export function useInfiniteScrollObserver({
  hasMore,
  onLoadMore,
  root = null,
  threshold = 0,
}: UseInfiniteScrollOptions) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && hasMore) {
        onLoadMore();
      }
    },
    [hasMore, onLoadMore]
  );

  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver(handleIntersection, {
    threshold,
    root,
    enabled: hasMore,
  });

  // ref를 loaderRef와 intersectionRef에 동시에 연결
  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      loaderRef.current = element;
      (intersectionRef as RefObject<HTMLDivElement | null>).current = element;
    },
    [intersectionRef]
  );

  return {
    loaderRef: setRef,
    isIntersecting,
  };
}
