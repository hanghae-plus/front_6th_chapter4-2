import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: RefObject<Element | null>;
  entry: IntersectionObserverEntry | null;
  isIntersecting: boolean;
}

export function useIntersectionObserver(
  callback?: (entry: IntersectionObserverEntry) => void,
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const { threshold = 0, root = null, rootMargin = '0px', enabled = true } = options;

  const ref = useRef<Element>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [firstEntry] = entries;
        setEntry(firstEntry);
        callback?.(firstEntry);
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [callback, threshold, root, rootMargin, enabled]);

  return {
    ref,
    entry,
    isIntersecting: entry?.isIntersecting ?? false,
  };
}
