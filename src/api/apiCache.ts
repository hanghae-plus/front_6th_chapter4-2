import { AxiosResponse } from "axios";

interface CacheItem<T> {
  data: Promise<AxiosResponse<T>>;
  timestamp: number;
  ttl: number;
}

export class ApiCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache = new Map<string, CacheItem<any>>();

  async get<T>(
    key: string,
    fetcher: () => Promise<AxiosResponse<T>>,
    ttl: number = 5 * 60 * 1000
  ): Promise<AxiosResponse<T>> {
    const now = Date.now();
    const cached = this.cache.get(key);

    // 캐시 확인
    if (cached && now - cached.timestamp < cached.ttl) {
      return cached.data; // 캐시된 데이터 반환
    }

    const promise = fetcher();

    // 에러 처리
    promise.catch(() => {
      this.cache.delete(key);
    });

    // 캐시에 저장
    this.cache.set(key, {
      data: promise,
      timestamp: now,
      ttl,
    });

    return promise;
  }
}
