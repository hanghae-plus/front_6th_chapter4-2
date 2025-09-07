import { PropsWithChildren } from "react";
import { DndContext, Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { CellSize, DAY_LABELS } from "./constants.ts";
import { useScheduleContext } from "./ScheduleContext.tsx";

// 드래그 스냅 함수 
// 그리드에 맞춰 강의 스냅, 컨테이너 밖을 나가지 않도록 제한
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
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const sensors = useSensors(
    // PointerSensor - 마우스나 터치 입력을 기준으로 드래그 감지
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 움직여야 드래그 시작
      },
    })
  );

  // 드래그 종료 시 호출
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, delta } = event;
    // active - 드래그한 아이템
    // delta - 이동 거리 

    const { x, y } = delta;
    const [tableId, index] = active.id.split(':');
    const schedule = schedulesMap[tableId][index];
    const nowDayIndex = DAY_LABELS.indexOf(schedule.day as typeof DAY_LABELS[number])

    // 이동한 그리드 계산
    const moveDayIndex = Math.floor(x / 80);
    const moveTimeIndex = Math.floor(y / 30);

    setSchedulesMap({
      ...schedulesMap,
      [tableId]: schedulesMap[tableId].map((targetSchedule, targetIndex) => {
        if (targetIndex !== Number(index)) {
          return { ...targetSchedule } // 다른 강의는 그대로 유지
        }
        return {
          ...targetSchedule,
          day: DAY_LABELS[nowDayIndex + moveDayIndex],
          range: targetSchedule.range.map(time => time + moveTimeIndex),
        }
      })
    })
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={modifiers}>
      {children}
    </DndContext>
  );
}
