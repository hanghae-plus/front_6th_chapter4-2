import { DndContext, type Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { PropsWithChildren } from "react";
import { CellSize, DAY_LABELS } from "./constants.ts";
import type { Schedule } from "./types.ts";

interface ScheduleDndProviderProps extends PropsWithChildren {
  tableId: string;
  schedules: Schedule[];
  onSchedulesChange: (schedules: Schedule[]) => void;
}

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
      x: Math.min(Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX), maxX),
      y: Math.min(Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY), maxY),
    };
  };
}

const modifiers = [createSnapModifier()];

export default function ScheduleDndProvider({ children, schedules, onSchedulesChange }: ScheduleDndProviderProps) {
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
    const [, index] = active.id.split(":");
    const schedule = schedules[Number(index)];
    const nowDayIndex = DAY_LABELS.indexOf(schedule.day as (typeof DAY_LABELS)[number]);
    const moveDayIndex = Math.floor(x / 80);
    const moveTimeIndex = Math.floor(y / 30);

    const updatedSchedules = schedules.map((targetSchedule, targetIndex) => {
      if (targetIndex !== Number(index)) {
        return { ...targetSchedule };
      }
      return {
        ...targetSchedule,
        day: DAY_LABELS[nowDayIndex + moveDayIndex],
        range: targetSchedule.range.map((time: number) => time + moveTimeIndex),
      };
    });

    onSchedulesChange(updatedSchedules);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={modifiers}>
      {children}
    </DndContext>
  );
}
