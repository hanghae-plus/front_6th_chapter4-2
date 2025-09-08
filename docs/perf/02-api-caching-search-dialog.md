# SearchDialog API 캐싱 적용 메모

## 무엇을 캐싱했나

- `fetchMajors`, `fetchLiberalArts`의 비동기 호출을 “한 번 생성된 Promise”로 캐싱.
- 유틸: `createCachedPromise(fn)` → 첫 호출에서만 `fn()` 실행, 이후 동일 Promise 재사용.
- 적용:
  - `const fetchMajorsCached = createCachedPromise(fetchMajors)`
  - `const fetchLiberalArtsCached = createCachedPromise(fetchLiberalArts)`

## 왜(정당성)

- 동일 리소스 중복 요청 방지(동시/반복 호출 합류, de-duplication).
- `Promise.all`의 병렬 대기 이점 유지하면서 재요청 없이 결과만 공유.
- React 18 개발 모드의 `StrictMode`로 `useEffect`가 2회 호출되어도 네트워크는 1회로 제한.

## 기대 효과

- 최초 로드: 전공/교양 각각 1회(총 2회) 요청으로 고정.
- 동일 세션 내 재진입/재호출: 네트워크 0회(캐시된 Promise 즉시 사용).
- 체감: 초기 로딩 지연 감소, 트래픽 절감, 불필요한 스피너 노출 감소.

## 검증 방법

- 콘솔 타임스탬프:
  - `console.log("API Call majors start", performance.now())`가 최초 1회만 찍히는지 확인.
- Network 탭:
  - `schedules-*.json`이 최초에만 각 1회, 이후에는 재요청 없음 확인(304 포함 불필요).
- Promise 동일성 체크:
  ```ts
  const p1 = fetchMajorsCached();
  const p2 = fetchMajorsCached();
  console.log(p1 === p2); // true → 동일 Promise 재사용
  ```

## 코드 포인트

```ts
// 1) 캐시 유틸
const createCachedPromise = <T>(fn: () => Promise<T>) => {
  let cached: Promise<T> | null = null;
  return () => (cached ??= fn()); // 최초 1회만 fn() 실행, 이후 동일 Promise 재사용
};

// 2) API 바인딩
const fetchMajors = () => axios.get<Lecture[]>("/schedules-majors.json");
const fetchLiberalArts = () =>
  axios.get<Lecture[]>("/schedules-liberal-arts.json");

const fetchMajorsCached = createCachedPromise(fetchMajors);
const fetchLiberalArtsCached = createCachedPromise(fetchLiberalArts);

// 3) 병렬 대기(재요청 없음)
const fetchAllLectures = async (): Promise<Lecture[]> => {
  const majorsPromise = fetchMajorsCached();
  const liberalPromise = fetchLiberalArtsCached();
  const [majorsRes, liberalRes] = await Promise.all([
    majorsPromise,
    liberalPromise,
  ]);
  return [...majorsRes.data, ...liberalRes.data];
};
```

## 한 줄 요약

- “처음 한 번만 네트워크 요청을 시작하고, 이후에는 같은 Promise를 재사용해 중복 호출을 없앤다.”
