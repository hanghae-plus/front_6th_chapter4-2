import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  lastPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const useInfiniteScroll = ({ lastPage, setPage }: UseInfiniteScrollProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderWrapperRef = useRef<HTMLDivElement>(null);

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
  }, [lastPage, setPage, loaderWrapperRef]);

  return { loaderRef, loaderWrapperRef };
};