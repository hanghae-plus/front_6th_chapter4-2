export const createCachedFetch = () => {
  const cache = new Map<string, unknown>();

  return async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    callNumber: number
  ): Promise<T> => {
    if (cache.has(key)) {
      console.log(`API Call ${callNumber}`, performance.now());
      return cache.get(key) as T;
    }

    console.log(`API Call ${callNumber}`, performance.now());
    const result = await fetchFn();
    cache.set(key, result);
    return result;
  };
};
