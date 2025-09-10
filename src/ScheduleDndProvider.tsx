import {
  DndContext,
  DragStartEvent,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { PropsWithChildren, useCallback } from 'react';
import { CellSize, DAY_LABELS } from './constants/constants.ts';
import { Schedule } from './types.ts';
import { useDragState } from './SchedulesDragStateProvider.tsx';
// import { store } from './store/externalStore.ts';
// import dummyScheduleMap from './mocks/dummyScheduleMap.ts';

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

interface Props extends PropsWithChildren {
  tableId: string;
  schedules: Schedule[];
  onScheduleUpdate: (tableId: string, schedules: Schedule[]) => void;
}

export default function ScheduleDndProvider({
  children,
  tableId,
  schedules,
  onScheduleUpdate,
}: Props) {
  const { setActiveTableId, setIsDragging } = useDragState();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const [dragTableId] = String(event.active.id).split(':');
    setActiveTableId(dragTableId);
    setIsDragging(true);
  }, []);
  const handleDragEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      const { active, delta } = event;
      const { x, y } = delta;
      const [dragTableId, index] = active.id.split(':');

      // 이 테이블의 드래그인 경우만 처리
      if (dragTableId !== tableId) {
        setActiveTableId(null);
        setIsDragging(false);
        return;
      }

      const schedule = schedules[Number(index)];
      const nowDayIndex = DAY_LABELS.indexOf(
        schedule.day as (typeof DAY_LABELS)[number]
      );
      const moveDayIndex = Math.floor(x / 80);
      const moveTimeIndex = Math.floor(y / 30);

      const updatedSchedules = schedules.map((targetSchedule, targetIndex) => {
        if (targetIndex !== Number(index)) {
          return targetSchedule;
        }
        return {
          ...targetSchedule,
          day: DAY_LABELS[nowDayIndex + moveDayIndex],
          range: targetSchedule.range.map(time => time + moveTimeIndex),
        };
      });

      onScheduleUpdate(tableId, updatedSchedules);
      setActiveTableId(null);
      setIsDragging(false);
    },
    [tableId, schedules, onScheduleUpdate]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      {children}
    </DndContext>
  );
}
