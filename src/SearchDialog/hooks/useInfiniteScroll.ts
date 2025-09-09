import { useEffect, useMemo, useRef, useState } from "react";
import { PAGE_SIZE } from "../services/timeSlots.ts";

/**
 * 무한 스크롤 기능을 관리하는 커스텀 훅
 * 페이지네이션 및 스크롤 감지를 담당합니다.
 */
export const useInfiniteScroll = <T>(items: T[]) => {
  const [page, setPage] = useState(1);
  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const lastPage = Math.ceil(items.length / PAGE_SIZE);

  const visibleItems = useMemo(() => {
    return items.slice(0, page * PAGE_SIZE);
  }, [items, page]);

  // 페이지 초기화 함수
  const resetPage = () => {
    setPage(1);
    loaderWrapperRef.current?.scrollTo(0, 0);
  };

  // Intersection Observer 설정
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
    visibleItems,
    loaderWrapperRef,
    loaderRef,
    resetPage,
  };
};
