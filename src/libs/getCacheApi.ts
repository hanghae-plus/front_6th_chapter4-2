const createCacheInstance = () => {
  const cacheData = new Map<string, unknown>();

  const get = (key: string) => {
    return cacheData.get(key);
  };

  const set = (key: string, value: unknown) => {
    cacheData.set(key, value);
  };

  return { get, set };
};

const createPendingPromiseInstance = () => {
  const pendingPromiseMap = new Map<string, Promise<unknown>>();

  const get = (key: string) => {
    return pendingPromiseMap.get(key);
  };

  const set = (key: string, value: Promise<unknown>) => {
    pendingPromiseMap.set(key, value);
  };

  const remove = (key: string) => {
    pendingPromiseMap.delete(key);
  };

  return {
    get,
    set,
    remove,
  };
};

const cacheInstance = createCacheInstance();
const pendingPromiseInstance = createPendingPromiseInstance();

export const getCacheApi = async <T>({
  key,
  queryFn,
}: {
  key: string;
  queryFn: () => Promise<T>;
}): Promise<T> => {
  const cacheData = cacheInstance.get(key);

  if (cacheData) {
    return cacheData as T;
  }

  const pendingPromise = pendingPromiseInstance.get(key);

  if (pendingPromise) {
    return pendingPromise as Promise<T>;
  }

  const promise = queryFn();
  pendingPromiseInstance.set(key, promise);

  try {
    const data = await promise;
    cacheInstance.set(key, data);
    return data;
  } catch (err) {
    pendingPromiseInstance.remove(key);
    throw err;
  }
};
