type AsyncFunction<TArgs extends any[], TReturn> = (
  ...args: TArgs
) => Promise<TReturn>;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

interface CacheStats {
  cacheSize: number;
  pendingRequests: number;
  cachedKeys: string[];
}

interface CacheManager {
  createCachedFunction: <TArgs extends any[], TReturn>(
    fn: AsyncFunction<TArgs, TReturn>,
    options?: CacheOptions
  ) => AsyncFunction<TArgs, TReturn>;
  clearCache: (pattern?: string) => void;
  getCacheStats: () => CacheStats;
}

const createCacheManager = (): CacheManager => {
  const globalCache = new Map<string, CacheEntry<any>>();
  const pendingRequests = new Map<string, Promise<any>>();

  return {
    createCachedFunction: <TArgs extends any[], TReturn>(
      fn: AsyncFunction<TArgs, TReturn>,
      options: CacheOptions = {}
    ): AsyncFunction<TArgs, TReturn> => {
      const { ttl = 0, prefix = fn.name } = options;

      return async (...args: TArgs): Promise<TReturn> => {
        const key = `${prefix}:${JSON.stringify(args)}`;
        const now = Date.now();

        // 캐시 확인
        if (globalCache.has(key)) {
          const entry = globalCache.get(key)!;
          if (ttl === 0 || now - entry.timestamp < ttl) {
            console.log(`[캐시] HIT - ${key}`);
            return entry.data;
          } else {
            globalCache.delete(key);
            console.log(`[캐시] EXPIRED - ${key}`);
          }
        }

        // 진행 중인 요청 확인
        if (pendingRequests.has(key)) {
          console.log(`Waiting for pending global request:`, key);
          return await pendingRequests.get(key)!;
        }

        console.log(`[캐시] MISS - 새로운 요청 시작:`, key);
        const promise = fn(...args);
        pendingRequests.set(key, promise);

        try {
          const result = await promise;
          globalCache.set(key, { data: result, timestamp: now });
          console.log(`[캐시] 저장됨 - ${key}`);
          return result;
        } finally {
          pendingRequests.delete(key);
        }
      };
    },

    clearCache: (pattern?: string): void => {
      if (pattern) {
        for (const key of globalCache.keys()) {
          if (key.includes(pattern)) {
            globalCache.delete(key);
          }
        }
      } else {
        globalCache.clear();
      }
    },

    getCacheStats: (): CacheStats => ({
      cacheSize: globalCache.size,
      pendingRequests: pendingRequests.size,
      cachedKeys: Array.from(globalCache.keys()),
    }),
  };
};

export const cacheManager = createCacheManager();
