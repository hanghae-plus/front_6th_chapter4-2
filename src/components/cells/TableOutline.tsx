import { Box } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { useDndContext } from "@dnd-kit/core";

interface Props {
  tableId: string;
}

function TableOutline({ tableId }: Props) {
  const dndContext = useDndContext();

  const activeTableId = useMemo(() => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  }, [dndContext.active?.id]);

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      outline={activeTableId === tableId ? "5px dashed" : undefined}
      outlineColor="blue.300"
      pointerEvents="none"
    />
  );
}

export default memo(TableOutline);
