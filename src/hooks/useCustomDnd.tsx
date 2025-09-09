import { useDndContext } from "@dnd-kit/core";
import { useMemo } from "react";

export default function useCustomDnd() {
  const dndContext = useDndContext();

  const activeId = useMemo(() => {
    return dndContext.active?.id
      ? String(dndContext.active.id).split(":")[0]
      : null;
  }, [dndContext.active]);

  return { activeId };
}
