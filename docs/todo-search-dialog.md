# SearchDialog 성능 TODO 체크리스트

아래 항목을 하나씩 진행하고, 완료 시 체크합니다. 각 항목은 간결히 “왜/어떻게/검증”을 메모합니다.

## 1) 필터 계산 최소화

- [x] 왜: 렌더마다 전체 필터 재계산 → CPU 과다
- [x] 어떻게: `useMemo`로 `filteredLectures`, `allMajors` 메모이즈 (deps: `[lectures, searchOptions]`)
- [x] 검증: 페이지 증가 시 재계산 없음(Profiler), Commit time 완만

## 2) 스케줄 파싱 캐시

- [x] 왜: `parseSchedule`가 같은 강의에 반복 실행
- [x] 어떻게: `Map(lecture.id → parsed)` 캐시(`useRef`)로 1회만 파싱
- [x] 검증: 요일/시간 필터 변경 시 CPU 사용 감소

## 3) 검색어 디바운스

- [x] 왜: 타이핑마다 전체 필터 → 잦은 재계산
- [x] 어떻게: 150–300ms 디바운스로 `query` 반영 지연
- [x] 검증: 타이핑 중 렌더/계산 빈도 감소

## 4) 강의 테이블 행 메모화

- [x] 왜: 무한스크롤 시 모든 기존 행 재렌더 → 누적 증가(600ms+)
- [x] 어떻게: `LectureRow` 컴포넌트 `React.memo` + `addSchedule` `useCallback` 안정화
- [x] 검증: 페이지 증가 패턴 변화(누적 증가 → 일정 유지), 신규 행만 렌더링 확인
