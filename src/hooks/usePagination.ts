import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SEARCH_PAGE_SIZE } from '../constants';

export const usePagination = <T>(items: T[]) => {
  const [page, setPage] = useState(1);
  const loaderWrapperRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const lastPage = Math.ceil(items.length / SEARCH_PAGE_SIZE);

  const visibleItems = useMemo(() => {
    return items.slice(0, page * SEARCH_PAGE_SIZE);
  }, [items, page]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const scrollToTop = useCallback(() => {
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  // items가 변경되면 페이지 리셋
  useEffect(() => {
    setPage(1);
  }, [items]);

  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => Math.min(lastPage, prevPage + 1));
        }
      },
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  return {
    page,
    setPage,
    visibleItems,
    resetPage,
    scrollToTop,
    loaderWrapperRef,
    loaderRef,
  };
};
