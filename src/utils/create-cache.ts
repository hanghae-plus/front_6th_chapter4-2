export const createCache = <T>(fn: () => Promise<T>) => {
  let cache: T | null = null;
  let isLoading = false;
  let loadingPromise: Promise<T> | null = null;

  return async (): Promise<T> => {
    // 1. 캐시 확인
    if (cache !== null) {
      return cache;
    }

    // 2. 중복 호출 방지
    if (isLoading && loadingPromise) {
      return loadingPromise;
    }

    isLoading = true;
    loadingPromise = fn();

    try {
      const result = await loadingPromise;
      cache = result;
      return result;
    } finally {
      isLoading = false;
      loadingPromise = null;
    }
  };
};
