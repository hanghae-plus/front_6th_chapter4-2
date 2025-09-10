# DnD(드래그/드롭) 리렌더링 최적화 보고서

## 무엇을 바꿨나

- 대상: `src/ScheduleTables.tsx`, `src/ScheduleTable.tsx`, `src/ScheduleDndProvider.tsx`
- 변경: 드래그와 드롭 시 불필요한 리렌더링을 각각 다른 관점에서 차단
  - 드래그(Drag): `DndContext` 범위를 “테이블 단위”로 축소해 구독 범위를 격리
  - 드롭(Drop): 테이블 프레임(제목/버튼/컨테이너)을 `TableCard`로 분리하여 `React.memo`로 스킵
  - 콜백 안정화: `duplicate`, `remove`, `openSearch`를 `useCallback`/`useAutoCallback`으로 참조 고정

## 왜 바꿨나

### 문제 1: 드래그 시작 시 여러 테이블이 함께 리렌더

- 원인: dnd-kit의 `DndContext` 상태(`active`, `over`, `delta` 등)가 바뀌면 해당 컨텍스트를 구독하는 모든 컴포넌트가 리렌더됩니다.
- 컨텍스트 범위가 넓으면(상위에 위치) 모든 테이블의 드래그블 아이템이 구독 → 드래그 시작만으로도 전체 리렌더가 발생합니다.

### 문제 2: 드롭 시 다른 테이블의 “프레임”까지 리렌더

- 원인: 드롭 시 전역 스케줄 상태(`setSchedulesMap`)가 변경되어 상위(`ScheduleTables`)가 리렌더됩니다.
- 자식 테이블 본문은 `React.memo` 덕에 대부분 스킵되지만, 상위에서 직접 그리는 프레임(제목/버튼/컨테이너)은 메모가 아니면 렌더가 다시 실행되어 DevTools 하이라이트에 깜빡임이 보입니다.

## 어떻게 해결했나

### 1단계: 드래그 범위 격리(DndContext 스코프 축소)

- 조치: `ScheduleDndProvider`를 “테이블 단위”로 유지하여 각 테이블별로 독립적인 `DndContext`를 갖도록 함.
- 효과: 드래그 시작/이동 시에도 해당 테이블의 드래그블 아이템만 컨텍스트 변경을 구독 → 다른 테이블은 영향 없음.

참고 코드

- `DndContext`와 스냅 모디파이어 구성: `src/ScheduleDndProvider.tsx:1`
- 테이블 내부에서 Provider 사용: `src/ScheduleTables.tsx:1`

가이드

- `ScheduleDndProvider`를 앱 최상위로 올리면 모든 테이블이 동일 컨텍스트를 구독하게 되어 드래그 시 전체 리렌더가 재발합니다. 반드시 “테이블 내부”에서 감싸세요.

### 2단계: 드롭 시 프레임 리렌더 차단(TableCard 분리 + 메모)

- 조치: 테이블 프레임(제목/버튼/컨테이너)과 본문을 `TableCard`로 분리하고 `React.memo` 적용.
- 조치: `duplicate`, `remove`를 `useCallback`으로 감싸 참조 안정화. `openSearch`도 안정화되어 있어 props 동일성을 보장.
- 효과: 전역 상태 변경으로 부모가 리렌더되어도 “변경 없는 테이블”의 `TableCard` props가 동일하므로 렌더 자체가 스킵됩니다(프레임 깜빡임 제거).

참고 코드

- `TableCard` 컴포넌트(메모 적용): `src/ScheduleTables.tsx:52`
- 콜백 안정화(`duplicate`, `remove`): `src/ScheduleTables.tsx:17`

추가 팁

- `setSchedulesMap` 업데이트 시 “변경된 테이블 key”만 새 배열을 만들고, 나머지 테이블은 기존 배열 참조를 그대로 유지해야 합니다. 그래야 `schedules` props의 참조 동일성이 보장됩니다.

### 3단계: DnD 관련 세부 최적화(선택)

- 정적 오버레이 분리: 활성 테이블 표시 오버레이를 별도 컴포넌트(`ActiveOutlineOverlay`)로 분리하고 `React.memo` 적용하여 파급 렌더를 줄임. `src/ScheduleTable.tsx:1`
- DragOverlay 도입: 드래그 중 실제 DOM 대신 오버레이로 미리보기 렌더 → 드래그 중 리렌더 영향면 최소화. 현재 구조로도 충분하면 생략 가능.
- 센서/모디파이어 안정화: `sensors`, `modifiers`는 렌더마다 동일 참조를 유지(현재 상수로 정의되어 안정적).

## 결과

### DevTools 렌더 하이라이트 기준

- 드래그 시작: 드래그 중인 테이블만 하이라이트, 다른 테이블은 변화 없음
- 드롭: 이동된 해당 테이블만 하이라이트, 다른 테이블의 프레임(제목/버튼/컨테이너)은 하이라이트되지 않음

### 성능 개선 효과

- 리렌더 범위: 전체 테이블 → 변경된 테이블로 국소화(프레임 렌더 제거)
- 사용자 체감: 드래그/드롭 시 깜빡임 최소화, 상호작용 더욱 부드러움

## 재현 방법

1. 앱 실행: `pnpm dev`
2. React DevTools → Profiler → ⚙️ → "Highlight updates when components render" 체크
3. 시간표 2에서 드래그 시작/드롭 수행
4. 관찰 포인트
   - 드래그: 시간표 2 외 다른 테이블은 하이라이트되지 않음
   - 드롭: 시간표 2만 하이라이트, 다른 테이블 프레임은 하이라이트되지 않음

## 핵심 학습 포인트

- 컨텍스트 스코프: 컨텍스트가 바뀌면 “구독 범위 전체가” 리렌더된다. 구독 범위를 축소해 영향면을 줄이는 것이 첫 해법.
- 경계 분리 + 메모: 전역 상태 변경은 피하기 어렵다. 대신 영향 경계를 컴포넌트로 분리하고 `React.memo`와 참조 안정화로 렌더를 스킵한다.
- 참조 동일성: 불변 업데이트 시 “변경된 조각만 새 참조”가 되도록 하고, 변경 없는 조각은 기존 참조를 보존해야 메모가 효과적이다.

