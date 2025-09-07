const cache = new Map<string, Promise<unknown>>();

export const memoizedFetch = <T>(key: string, fn: () => Promise<T>) => {
  if (cache.has(key)) {
    return cache.get(key) as Promise<T>;
  }
  const promise = fn();
  cache.set(key, promise);
  return promise;
};
