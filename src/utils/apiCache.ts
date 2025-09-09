/**
 * Promise 캐싱 옵션
 */
export interface PromiseCacheOptions {
  /** 캐시 만료 시간 (ms). 기본값: undefined (만료 없음) */
  ttl?: number;
  /** 최대 캐시 크기. 기본값: 100 */
  maxSize?: number;
  /** 디버그 모드 활성화 */
  debug?: boolean;
}/**

 * 캐시 통계 정보
 */
export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
}

/**
 * Promise 캐시 인터페이스
 */
export interface PromiseCache {
  <T>(key: string, fetcher: () => Promise<T>): Promise<T>;
  getStats(): CacheStats;
  clear(): void;
  delete(key: string): boolean;
}

export const createPromiseCache = (options: PromiseCacheOptions = {}): PromiseCache => {
  const { ttl, maxSize = 100, debug = false } = options;
  const cache = new Map<string, { promise: Promise<unknown>; timestamp?: number }>();
  const stats = { hits: 0, misses: 0 };

  const cacheFunction = <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
    const now = Date.now();

    // 캐시 확인 및 TTL 검사
    if (cache.has(key)) {
      const cached = cache.get(key)!;
      
      // TTL 확인 (설정된 경우)
      if (ttl && cached.timestamp && now - cached.timestamp > ttl) {
        if (debug) console.log(`캐시 만료: ${key}`);
        cache.delete(key);
      } else {
        stats.hits++;
        if (debug) {
          const hitRate = (stats.hits / (stats.hits + stats.misses) * 100).toFixed(1);
          console.log(`캐시 히트: ${key} (히트율: ${hitRate}%)`);
        }
        return cached.promise as Promise<T>;
      }
    }

    // LRU: 최대 크기 초과 시 가장 오래된 항목 제거
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
        if (debug) console.log(`LRU 제거: ${firstKey}`);
      }
    }

    // 새 Promise 생성
    stats.misses++;
    if (debug) console.log(`캐시 미스: ${key}`);

    const promise = fetcher().catch(error => {
      // 실패 시 캐시에서 제거
      cache.delete(key);
      if (debug) console.log(`API 호출 실패: ${key}`, error.message);
      throw error;
    });

    cache.set(key, { 
      promise, 
      timestamp: ttl ? now : undefined 
    });

    return promise;
  };

  // 유틸리티 메서드들
  cacheFunction.getStats = (): CacheStats => ({
    ...stats,
    size: cache.size
  });

  cacheFunction.clear = (): void => {
    cache.clear();
    stats.hits = 0;
    stats.misses = 0;
  };

  cacheFunction.delete = (key: string): boolean => {
    return cache.delete(key);
  };

  return cacheFunction as PromiseCache;
};

/**
 * API 호출용 미리 설정된 캐시
 * 개발 환경에서는 디버그 모드가 활성화됩니다.
 */
export const createApiCache = (options: PromiseCacheOptions = {}) => {
  return createPromiseCache({
    ttl: 5 * 60 * 1000, // 5분
    maxSize: 50,
    debug: process.env.NODE_ENV === 'development',
    ...options
  });
};