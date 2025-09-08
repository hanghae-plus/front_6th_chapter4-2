import { Box } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { memo, useMemo } from "react";

interface Props {
  tableId: string;
  children: React.ReactNode;
}

const DndContextWrapper = memo(({ tableId, children }: Props) => {
  const dndContext = useDndContext();
  const activeTableId = useMemo(
    () => (dndContext.active?.id ? String(dndContext.active.id).split(":")[0] : null),
    [dndContext.active?.id],
  );

  return (
    <Box position="relative" outline={activeTableId === tableId ? "5px dashed" : undefined} outlineColor="blue.300">
      {children}
    </Box>
  );
});

DndContextWrapper.displayName = "DndContextWrapper";

export default DndContextWrapper;
