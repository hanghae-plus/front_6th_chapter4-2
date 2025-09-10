# SearchDialog 스케줄 파싱 캐시 최적화 보고서

## 무엇을 바꿨나

- 대상: `src/SearchDialog.tsx`
- 변경: 동일 강의 스케줄 파싱 중복 제거 → 강의별 최초 1회만 파싱으로 수정
  - `useScheduleCache()` 커스텀 훅으로 캐시 로직 분리
  - `useRef<Map>` 기반 강의별 파싱 결과 캐시 도입
  - 요일·시간 필터링에서 `parseSchedule()` 직접 호출 → 캐시 함수 사용

## 왜 바꿨나

- 각 강의(`lecture.id`)에 대해 요일 필터와 시간 필터에서 중복으로 `parseSchedule()` 실행하는 문제 해결
- 정규식 처리가 포함된 `parseSchedule()`을 강의별 최초 1회로 제한하여 CPU 사용량 감소
- 사용자 필터 변경 시 반응성 개선(특히 타이핑·체크박스 조작)

## 결과(콘솔 로그 기준)

- Before: 각 강의마다 요일 필터링과 시간 필터링에서 각각 `parseSchedule` 실행
- After: 각 강의마다 최초 1회만 `parseSchedule` 실행, 이후 캐시에서 재사용
- 개선폭: 각 강의별 중복 파싱 1회 제거로 필터링 성능 향상

참고 로그 예시

- Before: (로그 없음, 중복 파싱 발생)
- After: `🔄 parseSchedule 실행: CS101`, `✅ 캐시 사용: CS101`
- 두 번째 필터링부터는 캐시 히트로 즉시 반환

## 장점

- **CPU 효율성**: 각 강의별 중복 정규식 파싱 제거
- **사용자 경험**: 필터 변경 시 지연 감소, 타이핑 반응성 향상
- **확장성**: 데이터 증가 시 성능 저하 완화
- **재사용성**: 커스텀 훅으로 분리하여 다른 컴포넌트에서도 활용 가능

## 단점

- **메모리 사용량**: 강의 수만큼 파싱 결과를 메모리에 저장
- **초기 부담**: 첫 필터링 시 전체 강의 파싱 필요
- **복잡성**: 캐시 로직 추가로 코드 복잡도 증가

## 재현 방법

1. 앱 실행: `pnpm dev`
2. 수업 검색 모달 열기
3. 콘솔에서 `parseSchedule` 실행 로그 확인
4. 요일/시간 필터 변경하며 캐시 사용 로그 관찰
   - 첫 번째: `🔄 parseSchedule 실행: [강의ID]`
   - 두 번째: `✅ 캐시 사용: [강의ID]`

## 코드 스니펫

```ts
// 스케줄 파싱 캐시 커스텀 훅
const useScheduleCache = () => {
  const scheduleCache = useRef(
    new Map<string, ReturnType<typeof parseSchedule>>()
  );

  const getParsedSchedule = (lecture: Lecture) => {
    if (!lecture.schedule) return [];

    // 캐시에 있으면 그대로 사용
    if (scheduleCache.current.has(lecture.id)) {
      console.log(`✅ 캐시 사용: ${lecture.id}`);
      return scheduleCache.current.get(lecture.id)!;
    }

    // 없으면 파싱하고 캐시에 저장
    console.log(`🔄 parseSchedule 실행: ${lecture.id}`);
    const parsed = parseSchedule(lecture.schedule);
    scheduleCache.current.set(lecture.id, parsed);
    return parsed;
  };

  return getParsedSchedule;
};

// SearchDialog 컴포넌트에서 사용
const getParsedSchedule = useScheduleCache();
```

## 기술적 선택 이유

### Map 자료구조 선택

- **성능**: O(1) 조회/저장/삭제 보장
- **안전성**: 프로토타입 오염 방지 (Object 대비)
- **타입**: TypeScript와 완벽 호환
- **메모리**: 효율적인 메모리 관리
- **편의성**: 직관적인 API (`has`, `get`, `set`, `delete`)

### useRef 선택

- **렌더링 간 데이터 유지**: 컴포넌트 리렌더링에도 캐시 유지
- **성능**: useState 대비 리렌더링 트리거 없음
- **메모리**: 컴포넌트 언마운트 시 자동 정리

## 적용 권장 조건

- **데이터 규모**: 수백~수천 건 강의 (과도하게 많지 않은 경우)
- **사용 패턴**: 필터 조건을 자주 변경하는 경우
- **메모리 환경**: 충분한 메모리가 확보된 환경
- **파싱 복잡도**: 정규식 등 무거운 연산이 포함된 경우
