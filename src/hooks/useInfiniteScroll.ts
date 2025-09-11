import React, { useEffect } from "react";

type useInfiniteScrollProps = {
    onIntersect: () => void;
    loaderRef: React.RefObject<HTMLDivElement | null>;
    loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
    options?: IntersectionObserverInit;
    enabled?: boolean;
};

export function useInfiniteScroll({
                                          onIntersect,
                                          loaderRef,
                                          loaderWrapperRef,
                                          options = {},
                                      enabled = true,
                                      }: useInfiniteScrollProps) {
    useEffect(() => {
        if (!enabled) return;
        const $loader = loaderRef.current;
        const $loaderWrapper = loaderWrapperRef.current;

        if (!$loader || !$loaderWrapper) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    onIntersect()
                }
            },
            { threshold: options?.threshold, root: $loaderWrapper }
        );

        observer.observe($loader);
        return () => observer.unobserve($loader);
    }, [ enabled, onIntersect, loaderRef, loaderWrapperRef, options ]);
}