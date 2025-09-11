function createFetchWithCache() {
  const cache = new Map<string, unknown>();

  return async function fetchWithCache<T>(
    fetchKey: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    if (cache.has(fetchKey)) {
      return cache.get(fetchKey) as T;
    }

    const result = await fetchFn();
    cache.set(fetchKey, result);
    return result;
  };
}

const fetchWithCache = createFetchWithCache();

export default fetchWithCache;
