import { useEffect } from "react";

interface UseIntersectionObserverOptions {
  target: React.RefObject<HTMLElement | null>;
  root?: React.RefObject<HTMLElement | null>;
  threshold?: number;
  rootMargin?: string;
  onIntersect: () => void;
  enabled?: boolean;
}

export function useIntersectionObserver({
  target,
  root,
  threshold = 0,
  rootMargin = "0px",
  onIntersect,
  enabled = true,
}: UseIntersectionObserverOptions) {
  useEffect(() => {
    if (!enabled) return;

    const $target = target.current;
    const $root = root?.current;

    if (!$target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold,
        rootMargin,
        root: $root,
      }
    );

    observer.observe($target);

    return () => observer.unobserve($target);
  }, [target, root, threshold, rootMargin, onIntersect, enabled]);
}
