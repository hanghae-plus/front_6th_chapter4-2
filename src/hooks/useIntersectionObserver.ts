import { useEffect, useRef } from "react";

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  options?: IntersectionObserverOptions;
  targetRef: React.RefObject<HTMLDivElement | null>;
  rootRef?: React.RefObject<HTMLDivElement | null>;
  enabled?: boolean;
}

export function useIntersectionObserver({
  onIntersect,
  options = {},
  targetRef,
  rootRef,
  enabled = true,
}: UseIntersectionObserverProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const target = targetRef.current;
    const root = rootRef?.current;

    if (!target) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold: options.threshold ?? 0,
        root: root ?? options.root ?? null,
        rootMargin: options.rootMargin,
      },
    );

    observerRef.current.observe(target);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [enabled, onIntersect, options.root, options.rootMargin, options.threshold, rootRef, targetRef]);
}
