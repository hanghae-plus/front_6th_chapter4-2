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

## 4) 핸들러/프롭 안정화

- [ ] 왜: 콜백/객체 리터럴 재생성 → 자식 리렌더
- [ ] 어떻게: `useCallback`/`useMemo`로 참조 안정화 (`changeSearchOption`, `addSchedule` 등)
- [ ] 검증: 자식 컴포넌트의 렌더 횟수 감소

## 5) 항목 컴포넌트 메모화

- [ ] 왜: 전공 항목/강의 행이 페이지 추가마다 전체 재렌더
- [ ] 어떻게: `MajorCheckboxItem`, `LectureRow` 분리 후 `React.memo`
- [ ] 검증: 신규 추가분만 렌더(Profiler 타임라인)

## 6) 정렬/가공 최소화

- [ ] 왜: 선택 시간 정렬 등 반복 가공 비용 누적
- [ ] 어떻게: 상태 갱신 시 1회 정렬, 렌더 경로에서는 사용만
- [ ] 검증: 작은 연산 누적 제거로 커밋 시간 소폭 개선

## (선택) 7) 리스트 가상화

- [ ] 왜: 수천 건 DOM 자체 비용 큼
- [ ] 어떻게: `react-window`로 가시 영역만 렌더
- [ ] 검증: 대량 데이터에서도 프레임 안정, 스크롤 부드러움

메모: 각 단계 전/후 Profiler 스냅샷(렌더 횟수, Commit time)과 간단 로그를 docs 폴더에 기록합니다.
