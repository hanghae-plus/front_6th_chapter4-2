import { DndContext, Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import React from "react";
import { CellSize } from "./constants/index.ts";

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

export default function ScheduleDndProvider({ children, handleDragStart, handleDragEnd }: {children: React.ReactNode, handleDragStart: () => void ,handleDragEnd: (event: any) => void}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={modifiers}>
      {children}
    </DndContext>
  );
}
