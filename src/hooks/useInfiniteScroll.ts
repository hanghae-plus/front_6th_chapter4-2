import { useCallback } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

interface UseInfiniteScrollOptions {
  loaderRef: React.RefObject<HTMLElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
  currentPage: number;
  lastPage: number;
  onLoadMore: (page: number) => void;
  threshold?: number;
  enabled?: boolean;
}

export function useInfiniteScroll({
  loaderRef,
  containerRef,
  currentPage,
  lastPage,
  onLoadMore,
  threshold = 0,
  enabled = true,
}: UseInfiniteScrollOptions) {
  const handleIntersect = useCallback(() => {
    if (currentPage < lastPage) {
      onLoadMore(currentPage + 1);
    }
  }, [currentPage, lastPage, onLoadMore]);

  useIntersectionObserver({
    target: loaderRef,
    root: containerRef,
    threshold,
    onIntersect: handleIntersect,
    enabled: enabled && currentPage < lastPage,
  });
}
