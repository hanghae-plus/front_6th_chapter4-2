# 08. DnD Active Outline Overlay로 드래그 중 리렌더 최소화

목표: 드래그 중 전체 테이블이 리렌더되는 문제를, “표시 전용 오버레이”로 분리해 최소화한다.

## 문제

- `ScheduleTable`에서 `useDndContext`를 직접 읽고 `outline`을 토글하면, 드래그 상태 변화마다 테이블(그리드+아이템)이 통째로 리렌더됨.
- 큰 컨테이너의 `outline` 스타일 변경은 레이아웃/페인트 범위가 커서 비용이 큼.

## 접근

- 드래그 활성 테이블만 덮는 얇은 오버레이 컴포넌트(`ActiveOutlineOverlay`)로 표시를 분리.
- 이 컴포넌트에서만 `useDndContext`를 구독(읽기 전용)하고, 나머지 테이블 UI는 컨텍스트를 모르게 함.
- 오버레이는 `pointerEvents="none"`으로 이벤트를 가로채지 않음 → 아래 그리드/아이템의 클릭/드래그에 영향 없음.

## 구현 요약

- 부모 컨테이너는 `position="relative"` 유지.
- 오버레이는 `position="absolute"`로 상하좌우 0, 점선(outline)만 그림.
- 활성 테이블 판별: `useDndContext().active?.id`에서 `tableId`를 파싱해 비교.

```tsx
// src/ScheduleTable.tsx (요약)
<Box position="relative">
  <ActiveOutlineOverlay tableId={tableId} />
  {/* Grid, Items ... */}
  ...
</Box>;

const ActiveOutlineOverlay = ({ tableId }: { tableId: string }) => {
  const { active } = useDndContext();
  const activeTableId = active?.id ? String(active.id).split(":")[0] : null;
  if (activeTableId !== tableId) return null;
  return (
    <Box
      pointerEvents="none"
      position="absolute"
      top={0}
      right={0}
      bottom={0}
      left={0}
      outline="5px dashed"
      outlineColor="blue.300"
      borderRadius="md"
    />
  );
};
```

## 왜 렌더링이 줄었나

- 컨텍스트 구독 범위 축소: `useDndContext`를 작은 오버레이로 가둬서, 드래그 상태 변화가 그 컴포넌트만 다시 그림.
- DOM 변경 최소화: 거대한 컨테이너의 스타일 토글 대신, 얇은 박스 하나의 표시/비표시 전환으로 페인트 비용이 작음.
- 좌표 기반 dnd-kit과 무관: 드래그는 `useDraggable`/센서에서 좌표 변환(CSS transform)으로 처리되며, 오버레이는 표시만 담당.

## 빠른 체크리스트

- 오버레이: `pointerEvents="none"`으로 이벤트 무시하는가?
- 활성 판별: `active.id` → `tableId` 파싱이 안전한가?
- 오버레이 외 컴포넌트가 `useDndContext`를 구독하지 않는가?

## 측정 팁

- React DevTools Profiler로 드래그 중 렌더 수 비교(변경 전/후).
- 드래그 프레임마다 그리드/비활성 아이템이 리렌더되지 않는지 확인.

## 드래그 중 실제 리렌더 범위

- 오버레이만: `ActiveOutlineOverlay`가 `useDndContext`를 구독하므로 드래그 상태가 바뀔 때 이 작은 컴포넌트만 리렌더됨.
- 활성 아이템만: 끌리는 `DraggableSchedule` 하나가 `useDraggable`의 `transform` 변화로 리렌더됨.
- 그 외 정지: 그리드와 비활성 아이템은 드래그 중 리렌더되지 않음(컨텍스트 비구독 + 부모 리렌더 차단 효과).
- 요약: “오버레이 + 활성 아이템”만 업데이트되고 나머지는 고정되어 성능 이점이 큼.
