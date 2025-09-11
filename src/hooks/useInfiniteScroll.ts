import { useEffect } from 'react';
import { Lecture } from '../types';

import { useInfiniteScrollObserver } from './useInfiniteScrollObserver';
import { usePagination } from './usePagination';

interface UseInfiniteScrollOptions {
  items: Lecture[];
  root?: Element | null;
}

export function useInfiniteScroll({ items, root }: UseInfiniteScrollOptions) {
  const { page, setPage, lastPage, visibleItems, hasMore, handleLoadMore, resetPage } =
    usePagination({ items });

  const { loaderRef } = useInfiniteScrollObserver({
    hasMore,
    onLoadMore: handleLoadMore,
    root,
  });

  useEffect(() => {
    resetPage();
  }, [items.length, resetPage]);

  return {
    page,
    setPage,
    lastPage,
    visibleItems,
    hasMore,
    loaderRef,
    resetPage,
  };
}
