import { useState, useMemo, useCallback } from 'react';
import { Lecture } from '../types';
import { PAGE_SIZE } from '../constants';
import { useInfiniteScrollObserver } from './useInfiniteScrollObserver';

interface UseInfiniteScrollOptions {
  items: Lecture[];
  root?: Element | null;
}

export function useInfiniteScroll({ items, root }: UseInfiniteScrollOptions) {
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

  const { loaderRef } = useInfiniteScrollObserver({
    hasMore,
    onLoadMore: handleLoadMore,
    root,
  });

  // 아이템이 변경되면 페이지 리셋
  useMemo(() => {
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
