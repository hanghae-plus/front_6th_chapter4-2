# SearchDialog 메모이제이션 적용 메모

## 무엇을 메모이즈했나

- `filteredLectures`: 검색 옵션과 데이터에 따른 필터 결과
- `allMajors`: 강의 데이터에서 전공 집합 추출 결과

## 왜(useMemo가 정당한가)

- 고비용 순수 계산: 수천 개 배열에 대해 다단 필터(O(N)) 및 집합 생성(O(N)).
- 의존성 경계 명확: `filteredLectures`는 `[lectures, searchOptions]`, `allMajors`는 `[lectures]`에만 의존.
- 렌더 트리거 분리: 페이지 증가(page)로는 결과 자체가 변하지 않음 → 재계산 불필요.
- 재사용성: 길이, 슬라이스, 카운트 등 동일 결과를 렌더 경로에서 여러 번 활용.

## 기대 효과

- 페이지네이션/스크롤 시 전체 재필터 방지 → CPU 사용 감소, 커밋 시간 완만.
- 대량 데이터(N ≫ 1000)에서 체감 반응 속도 향상.

## 검증 방법

- 로그: useMemo 블록에 로그 추가 후 `page` 변경 시 호출 없음 확인.

## 코드 포인트

- `filteredLectures = useMemo(() => /* 필터 */ , [lectures, searchOptions])`
- `allMajors = useMemo(() => [...new Set(lectures.map(l => l.major))], [lectures])`

주의

- `searchOptions`는 set 함수로 값이 바뀔 때 참조가 갱신되도록 유지.
- `parseSchedule` 비용은 별도 캐시(Map)로 추가 절감 예정.
