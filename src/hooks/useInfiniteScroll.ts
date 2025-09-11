import { useCallback, useRef, useState, useEffect } from "react";
import { PAGE_SIZE } from "../constants";
import { ProcessedLecture } from "../types";

export const useInfiniteScroll = (filteredLectures: ProcessedLecture[]) => {
  const [page, setPage] = useState(1);

  const observerRef = useRef<IntersectionObserver>(null);

  useEffect(() => {
    setPage(1);
  }, [filteredLectures]);

  const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);
  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);

  const hasMore = page < lastPage;

  const loaderRef = useCallback(
    (node: HTMLDivElement) => {
      const observer = observerRef.current;
      if (observer) {
        observer.disconnect();
        if (node) {
          observer.observe(node);
        }
      }
    },
    [observerRef.current]
  );

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    observerRef.current = observer;
  }, [handleLoadMore]);

  return { visibleLectures, loaderRef, hasMore };
};
