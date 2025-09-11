import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useDndContext } from "@dnd-kit/core";

interface DragStateContextType {
  activeTableId: string | null;
  isDragging: boolean;
}

const DragStateContext = createContext<DragStateContextType | undefined>(
  undefined
);

export const useDragState = () => {
  const context = useContext(DragStateContext);
  if (context === undefined) {
    throw new Error("useDragState must be used within a DragStateProvider");
  }
  return context;
};

export const DragStateProvider = ({ children }: PropsWithChildren) => {
  const dndContext = useDndContext();

  const dragState = useMemo(() => {
    const activeTableId = dndContext.active?.id
      ? String(dndContext.active.id).split(":")[0]
      : null;

    return {
      activeTableId,
      isDragging: !!dndContext.active,
    };
  }, [dndContext.active]);

  return (
    <DragStateContext.Provider value={dragState}>
      {children}
    </DragStateContext.Provider>
  );
};
