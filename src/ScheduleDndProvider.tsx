import {
  DndContext,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { PropsWithChildren } from "react";
import { CellSize } from "./constants.ts";
import { useScheduleActions } from "./context/ScheduleActionsContext.tsx";
import { DragStateProvider } from "./context/DragStateContext.tsx";

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

export default function ScheduleDndProvider({ children }: PropsWithChildren) {
  const { moveSchedule } = useScheduleActions();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, delta } = event;
    const { x, y } = delta;
    const [tableId, index] = active.id.split(":");

    // 델타 값을 셀 단위로 변환
    const moveDayIndex = Math.floor(x / CellSize.WIDTH);
    const moveTimeIndex = Math.floor(y / CellSize.HEIGHT);

    // 실제 이동이 있을 때만 업데이트
    if (moveDayIndex !== 0 || moveTimeIndex !== 0) {
      moveSchedule(tableId, Number(index), moveDayIndex, moveTimeIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      <DragStateProvider>{children}</DragStateProvider>
    </DndContext>
  );
}
