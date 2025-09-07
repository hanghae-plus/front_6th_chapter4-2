import { RefObject, useEffect } from "react";

type Props<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  onIntersect?: (entries: IntersectionObserverEntry[]) => void;
  options: IntersectionObserverInit;
};

export const useIntersectionObserver = <T extends HTMLElement>({ ref, onIntersect, options }: Props<T>) => {
  useEffect(() => {
    const $el = ref.current;
    if (!$el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect?.(entries);
        }
      },
      { threshold: 0, root: $el, ...options },
    );

    observer.observe($el);

    return () => observer.unobserve($el);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onIntersect]);
};
