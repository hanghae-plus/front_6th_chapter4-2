import { useState, useMemo, useCallback } from "react";

interface UsePaginationOptions<T> {
  items: T[];
  pageSize: number;
  initialPage?: number;
}

export function usePagination<T>({
  items,
  pageSize,
  initialPage = 1,
}: UsePaginationOptions<T>) {
  const [page, setPage] = useState(initialPage);

  const lastPage = useMemo(
    () => Math.ceil(items.length / pageSize),
    [items.length, pageSize]
  );

  const visibleItems = useMemo(
    () => items.slice(0, page * pageSize),
    [items, page, pageSize]
  );

  const handleLoadMore = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const resetPage = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  const goToPage = useCallback(
    (targetPage: number) => {
      setPage(Math.max(1, Math.min(targetPage, lastPage)));
    },
    [lastPage]
  );

  return {
    page,
    setPage,
    lastPage,
    visibleItems,
    handleLoadMore,
    resetPage,
    goToPage,
    hasMore: page < lastPage,
    totalItems: items.length,
  };
}
