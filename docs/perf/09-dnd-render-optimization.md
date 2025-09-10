# DnD 렌더링 최적화 정리(3단계)

목표: 드래그·드롭 등 전역 상태 변경 시 “변경된 테이블만” 다시 렌더하도록 만들어 불필요한 렌더를 최소화한다.

---

## 1단계 — 컨텍스트 분리(+ 사용처 적용): 상태와 디스패치 각각 사용처가 다르고, 함께 임포트하면 불필요한 렌더링이 많아진다.

- 문제: 하나의 컨텍스트에서 `schedulesMap`(상태)과 `setSchedulesMap`(액션)을 함께 제공해, “액션만 필요한 컴포넌트”까지 상태 변경 때마다 리렌더됨.
- 왜: 컨텍스트 value가 바뀌면 이를 구독하는 모든 곳이 리렌더된다. 액션만 필요해도 상태를 함께 구독하면 불필요한 리렌더가 발생.
- 어떻게:
  - 상태/디스패치 컨텍스트를 분리하고 전용 훅 제공.
    - 상태만: `useSchedulesState()`
    - 업데이트만: `useSchedulesDispatch()`
  - 사용처에서 목적에 맞는 훅만 사용하도록 교체.
  - 적용 파일: `src/ScheduleContext.tsx`, `src/SearchDialog.tsx`, `src/ScheduleTables.tsx`, `src/ScheduleDndProvider.tsx`
- 효과: 업데이트만 하는 컴포넌트는 전역 변경 시 리렌더 대상에서 제외되어 전파 비용이 크게 줄어듦.

---

## 2단계 — DnD 드롭 로직 함수형 업데이트(상태 비의존): 굳이 상태를 구독시키지 않고 디스패치만 구독시키고 prev로 업데이트하면 리렌더링이 줄어든다.

- 문제: `src/ScheduleDndProvider.tsx`가 전역 `schedulesMap`을 읽어 드롭을 처리하여, Provider가 상태를 구독하고 드롭마다 리렌더됨.
- 왜: 상태를 읽으면(컨텍스트 구독) 상태 변경 시 해당 컴포넌트도 리렌더된다. DnD는 “상태 수정(디스패치)”만 필요할 뿐 읽을 필요는 없음.
- 어떻게:
  - 상태 읽기 제거: `useSchedulesDispatch()`만 사용.
  - 함수형 업데이트로 prev 기반 계산:
    - 이동량 계산: `moveDayIndex = Math.floor(x / CellSize.WIDTH)`, `moveTimeIndex = Math.floor(y / CellSize.HEIGHT)`
    - 업데이트: `setSchedulesMap(prev => { const list = prev[tableId]; const current = list[index]; const nextList = ...; return { ...prev, [tableId]: nextList }; })`
    - 가드: 대상 테이블/인덱스가 없으면 `prev` 반환.
  - 적용 파일: `src/ScheduleDndProvider.tsx`
- 효과: DnD Provider는 더 이상 전역 상태를 구독하지 않아 드롭 시 불필요한 리렌더가 사라지고, 변경 없는 참조가 유지되어 하위 `React.memo`가 잘 동작.

---

## 3단계 — 불변 업데이트 + 핸들러/키 안정화(리스트 렌더 최적화): 계층마다 함수 참조 안정화.

- 문제: (1) 삭제 시 원본 변형(`delete prev[key]`)으로 참조가 흔들림, (2) 부모에서 인라인 핸들러 생성으로 자식이 매번 다른 props로 인식, (3) index 기반 key로 리마운트 발생.
- 왜:
  - 원본 변형은 “변경 안 된 값의 참조 유지”를 깨뜨려 `memo` 최적화를 무력화함.
  - 인라인 핸들러는 렌더 때마다 새 함수가 생성되어 자식이 매번 변경으로 인식.
  - index key는 삭제/삽입 시 노드가 재사용되지 않아 불필요한 리마운트 유발.
- 어떻게:
  - 불변 삭제: `Object.fromEntries(Object.entries(prev).filter(([k]) => k !== targetId))`
    - 적용: `src/ScheduleTables.tsx`의 `remove()`
  - 핸들러 안정화: 부모는 참조 안정화된 함수를 내려주고, 자식은 이를 래핑해 자체 핸들러를 `useCallback`으로 고정
    - 부모(ScheduleTables): `openSearch`를 `useCallback`으로 안정화해 `ScheduleTable`에 전달
    - 자식(ScheduleTable): 전달받은 `openSearch`를 래핑
      - `handleScheduleTimeClick(day,time)` → `openSearch(tableId, { day, time })`
      - `handleDeleteButtonClick(day,time)` → `setSchedulesMap(prev => ({ ...prev, [tableId]: prev[tableId].filter(...) }))`
    - 컨테이너 없이도 참조 안정성 유지(필요 시에만 소형 컨테이너 고려)
    - 적용: 부모 `src/ScheduleTables.tsx`(openSearch 안정화), 자식 `src/ScheduleTable.tsx`(핸들러 이관)
  - 키 안정화: 리스트 key는 `tableId` 같은 고유값 사용
    - 적용: `src/ScheduleTables.tsx`의 테이블 매핑
  - 비용 축소: 색상 계산/리스트 항목 렌더를 `useMemo`/`React.memo`로 경량화
    - 적용: `src/ScheduleTable.tsx` 색상 계산 메모이제이션 등
- 효과: 변경된 테이블만 리렌더, 나머지는 `memo`로 스킵. 삭제/추가 시 리마운트 최소화로 체감 성능이 크게 개선.

---

## 4단계 — 정적 격자 분리 + 아이템 메모화(체감 전체 리렌더 제거)

- 문제: 테이블 업데이트 때 정적 격자(헤더/타임셀)까지 함께 다시 렌더되어 “전체가 리렌더”되는 체감이 발생. 또한 변경되지 않은 아이템도 함수 prop 재생성 등으로 리렌더될 수 있음.
- 왜:
  - 격자 DOM이 상대적으로 크고, 매번 다시 그리면 비용이 큼.
  - 아이템에 전달되는 콜백이 매번 새로 만들어지면 `memo` 비교를 통과하지 못함.
- 어떻게:
  - 격자 분리 및 메모화: 정적 격자를 `TimeGrid` 컴포넌트로 분리하고 `React.memo` 적용. props로는 참조 안정화된 `onCellClick`만 전달.
    - 적용: `src/ScheduleTable.tsx` 내 `TimeGrid` 추가, 본문에서 `<TimeGrid onCellClick={handleScheduleTimeClick} />`로 교체
  - 아이템 메모화 + 내부 래핑 삭제: `DraggableSchedule`을 `React.memo`로 감싸고, 삭제는 내부에서 `onDelete(day, time)`로 래핑 호출해 부모의 함수 재생성 영향을 최소화.
    - 적용: `src/ScheduleTable.tsx`의 `DraggableSchedule` 정의/호출부
- 효과: ScheduleTable이 리렌더되어도 정적 격자는 동일 props로 스킵되고, 변경되지 않은 아이템도 리렌더를 건너뛰어 실질적으로 “이동한 아이템만” 다시 그리는 동작에 가깝게 동작.

---

## 5단계 — 드래그(컨텍스트 스코프 최적화)

- 원인: dnd-kit의 `DndContext` 상태(`active`, `over`, `delta` 등)가 변하면 해당 컨텍스트를 구독하는 모든 컴포넌트가 리렌더됨.
- 처방: `ScheduleDndProvider`를 테이블 단위로 유지해 각 테이블이 독립 컨텍스트를 갖도록 스코프를 축소.
  - 위치를 상위(앱 전체)로 올리면 모든 테이블이 동일 컨텍스트를 구독 → 드래그 시작만으로 전체 리렌더 재발.
- 기대 효과: 드래그 중인 테이블만 리렌더, 다른 테이블은 영향 없음.
- 관련 코드: `src/ScheduleTables.tsx`(테이블 내부 Provider 배치), `src/ScheduleDndProvider.tsx`

## 6단계 — 드롭(전역 상태 전파 최소화)

- 원인: 드롭 시 `setSchedulesMap`으로 전역 상태가 바뀌고, 이를 렌더하는 상위가 리렌더되면서 프레임(제목/버튼/컨테이너)도 다시 그림.
- 처방: 프레임을 `TableCard`로 분리해 `React.memo` 적용, 전달 props는 `useCallback`으로 참조 안정화. 변경 없는 테이블은 프레임 렌더 자체를 스킵.
- 가이드:
  - 상태 업데이트는 함수형(prev)으로만 수행하고, 변경된 테이블 key만 새 배열 생성.
  - `openSearch`/`duplicate`/`remove`는 `useCallback`으로 고정.
  - 본문(`ScheduleTable`)은 그대로 두되, 프레임(`TableCard`)을 별도 컴포넌트로 메모.
- 관련 코드: 테이블 프레임 분리/메모 `src/ScheduleTables.tsx:52`, 드롭 함수형 업데이트 `src/ScheduleDndProvider.tsx:48`

### 자주 하는 실수와 증상

- 드래그: `ScheduleDndProvider`를 앱 최상위에 배치 → 드래그 시작 시 모든 테이블 하이라이트.
- 드롭: 프레임을 메모하지 않음 → 드롭 때 다른 테이블의 제목/버튼도 하이라이트.
- 드롭: `remove`에서 원본 변형/새 객체 남발 → 참조 동등성 깨져 `memo` 무력화.

### 재현/검증 시나리오

1. React DevTools → ⚙️ → "Highlight updates when components render" 활성화
2. 시간표 2에서 드래그 시작 → 시간표 2만 하이라이트되어야 함
3. 드롭 수행 → 시간표 2만 하이라이트되어야 하며, 1/3/4의 프레임(제목/버튼/컨테이너)은 하이라이트되지 않아야 함

### 코드 레퍼런스

- 테이블 프레임 분리/메모: `src/ScheduleTables.tsx:52`
- 드롭 함수형 업데이트: `src/ScheduleDndProvider.tsx:48`
- 정적 격자/아이템 메모: `src/ScheduleTable.tsx:1`

---

## 7단계 — Popover lazy unmount(드래그 중 숨김 렌더 제거)

- 문제: 드래그 중 `useDraggable`의 `transform`이 매 이동마다 바뀌어 아이템 컴포넌트가 리렌더되는데, 같은 컴포넌트 안에 있는 Chakra `Popover` 트리(닫힌 상태)도 함께 리렌더되어 비용이 증가함. Chakra 기본값은 닫혀 있어도 콘텐츠가 트리에 남아있음.
- 어떻게: `Popover`에 `isLazy`와 `lazyBehavior="unmount"`를 지정해 닫혀 있을 때 콘텐츠를 아예 언마운트.
  - 적용 파일: `src/ScheduleTable.tsx`
  - 변경: `<Popover isLazy lazyBehavior="unmount">`
- 효과: 드래그 중(팝오버 닫힘)에는 Popover 콘텐츠 트리가 존재하지 않아 리렌더 전파가 차단됨. 드래그 체감 부드러움 향상.

---

## 체크리스트

- [ ] 액션만 필요한 곳은 `useSchedulesDispatch()`만 사용한다.
- [ ] DnD 드롭은 함수형 업데이트로 prev 기반 계산만 수행한다.
- [ ] 삭제/복제는 불변 업데이트로 참조를 유지한다.
- [ ] 리스트 key는 `tableId` 등 고유키를 사용한다(인덱스 금지).
- [ ] 인라인 핸들러를 지양하고 `useCallback`으로 안정화한다.

---

## 비고

- 레퍼런스 워크스페이스는 “테이블 전용 Provider/컨테이너” 없이도, 위 전략(함수형 업데이트 + 핸들러/메모 최적화)만으로 충분히 최적화됨.
