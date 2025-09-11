import { useState, useMemo, useCallback } from 'react';
import { Lecture } from '../types';
import { PAGE_SIZE } from '../constants';

interface UsePaginationOptions {
  items: Lecture[];
}

export function usePagination({ items }: UsePaginationOptions) {
  const [page, setPage] = useState(1);

  const lastPage = useMemo(() => Math.ceil(items.length / PAGE_SIZE), [items.length]);

  const visibleItems = useMemo(() => items.slice(0, page * PAGE_SIZE), [items, page]);

  const hasMore = page < lastPage;

  const handleLoadMore = useCallback(() => {
    setPage((prevPage) => Math.min(lastPage, prevPage + 1));
  }, [lastPage]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    setPage,
    lastPage,
    visibleItems,
    hasMore,
    resetPage,
    handleLoadMore,
  };
}
