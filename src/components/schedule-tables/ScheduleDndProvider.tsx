import {
  DndContext,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { PropsWithChildren, useCallback } from 'react';
import { CellSize, DAY_LABELS } from '../../constants';
import { useScheduleContext } from '../../ScheduleContext';

function createSnapModifier(): Modifier {
  return ({ transform, containerNodeRect, draggingNodeRect }) => {
    const containerTop = containerNodeRect?.top ?? 0;
    const containerLeft = containerNodeRect?.left ?? 0;
    const containerBottom = containerNodeRect?.bottom ?? 0;
    const containerRight = containerNodeRect?.right ?? 0;

    const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {};

    const minX = containerLeft - left + 120 + 1;
    const minY = containerTop - top + 40 + 1;
    const maxX = containerRight - right;
    const maxY = containerBottom - bottom;

    return {
      ...transform,
      x: Math.min(
        Math.max(
          Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH,
          minX
        ),
        maxX
      ),
      y: Math.min(
        Math.max(
          Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT,
          minY
        ),
        maxY
      ),
    };
  };
}

const modifiers = [createSnapModifier()];

interface ScheduleDndProviderProps extends PropsWithChildren {
  tableId?: string;
}

export const ScheduleDndProvider = ({
  children,
  tableId,
}: ScheduleDndProviderProps) => {
  // ✅ 수정: Hook을 최상위 레벨에서 호출
  const { actions } = useScheduleContext();

  // ✅ 수정: useSensors를 최상위에서 직접 호출
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // ✅ 수정: handleDragEnd를 useCallback으로 메모이제이션
  const handleDragEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      const { active, delta } = event;
      const { x, y } = delta;
      const [dragTableId, indexStr] = active.id.split(':');
      const scheduleIndex = Number(indexStr);

      // 이동 계산
      const moveDayIndex = Math.floor(x / CellSize.WIDTH);
      const moveTimeIndex = Math.floor(y / CellSize.HEIGHT);

      // ✅ 새로운 moveSchedule 액션 사용
      actions.moveSchedule(
        dragTableId,
        scheduleIndex,
        moveDayIndex,
        moveTimeIndex
      );
    },
    [actions] // actions만 의존성으로 설정
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      {children}
    </DndContext>
  );
};
