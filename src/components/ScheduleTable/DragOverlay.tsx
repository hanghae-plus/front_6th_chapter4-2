import { Box } from '@chakra-ui/react';
import { useDndContext } from '@dnd-kit/core';
import { memo } from 'react';

const DragOverlay = memo(({ tableId }: { tableId: string }) => {
  const dndContext = useDndContext();

  const getActiveTableId = () => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(':')[0];
    }
    return null;
  };

  const activeTableId = getActiveTableId();
  const isActive = activeTableId === tableId;

  console.log('DragOverlay render:', tableId, isActive); // 디버깅용

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      outline={isActive ? '5px dashed' : 'none'}
      outlineColor="blue.300"
      pointerEvents="none"
      zIndex={1}
    />
  );
});

DragOverlay.displayName = 'DragOverlay';
export default DragOverlay;
