export const createCachedFetch = () => {
  const promiseCache = new Map<string, Promise<unknown>>();

  return async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    callNumber: number
  ): Promise<T> => {
    if (promiseCache.has(key)) {
      console.log(`API Call ${callNumber}`, performance.now());
      return promiseCache.get(key) as Promise<T>;
    }

    console.log(`API Call ${callNumber}`, performance.now());
    const promise = fetchFn()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        promiseCache.delete(key);
        throw error;
      });

    promiseCache.set(key, promise as Promise<unknown>);
    return promise;
  };
};
