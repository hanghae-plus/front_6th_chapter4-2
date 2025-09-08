import { AxiosResponse } from 'axios';

export function createCachedApi<T>(
  apiFunction: () => Promise<AxiosResponse<T>>
): () => Promise<AxiosResponse<T>> {
  let cachedData: AxiosResponse<T> | null = null;
  let pendingPromise: Promise<AxiosResponse<T>> | null = null;

  return async () => {
    // 캐시가 있다면 그대로 반환
    if (cachedData) {
      return cachedData;
    }

    // 이미 요청 충이면 그거 그대로 반환
    if (pendingPromise) {
      return pendingPromise;
    }

    // 새로운 요청 시작
    pendingPromise = apiFunction();

    try {
      const response = await pendingPromise;
      cachedData = response;

      return response;
    } finally {
      pendingPromise = null; // 완료 후 초기화
    }
  };
}
