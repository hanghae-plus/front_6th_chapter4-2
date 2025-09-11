import React, { useEffect } from "react";

type useInfiniteScrollProps = {
    onIntersect: () => void;
    loaderRef: React.RefObject<HTMLDivElement | null>;
    loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
    options?: IntersectionObserverInit;
};

export function useInfiniteScroll({
                                          onIntersect,
                                          loaderRef,
                                          loaderWrapperRef,
                                          options = {},
                                      }: useInfiniteScrollProps) {
    useEffect(() => {
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
    }, [onIntersect, loaderRef, loaderWrapperRef, options]);
}