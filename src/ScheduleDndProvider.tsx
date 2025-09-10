import { DndContext, Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { PropsWithChildren, useCallback } from "react";
import { CellSize, DAY_LABELS } from "./constants.ts";
import { useSchedulesData, useSchedulesActions } from "./ScheduleContext.tsx";

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


    return ({
      ...transform,
      x: Math.min(Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX), maxX),
      y: Math.min(Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY), maxY),
    })
  };
}

const modifiers = [createSnapModifier()]

export default function ScheduleDndProvider({ children }: PropsWithChildren) {
  const { setSchedulesMap } = useSchedulesActions();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = useCallback((event: any) => {
    const { active, delta } = event;
    const { x, y } = delta;
    const [tableId, index] = active.id.split(':');
    
    setSchedulesMap(prev => {
      const schedule = prev[tableId][index];
      const nowDayIndex = DAY_LABELS.indexOf(schedule.day as typeof DAY_LABELS[number])
      const moveDayIndex = Math.floor(x / 80);
      const moveTimeIndex = Math.floor(y / 30);

      const newSchedules = prev[tableId].map((targetSchedule, targetIndex) => {
        if (targetIndex !== Number(index)) {
          return targetSchedule; // 변경되지 않은 스케줄은 참조 유지
        }
        return {
          ...targetSchedule,
          day: DAY_LABELS[nowDayIndex + moveDayIndex],
          range: targetSchedule.range.map(time => time + moveTimeIndex),
        }
      });
      
      // 변경된 테이블만 새로 생성
      return {
        ...prev,
        [tableId]: newSchedules
      };
    })
  }, [setSchedulesMap]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={modifiers}>
      {children}
    </DndContext>
  );
}
