import { Box } from '@chakra-ui/react';
import { useDndContext } from '@dnd-kit/core';
import { memo, useCallback } from 'react';
import { Schedule } from '../../types.ts';
import DragOverlay from './DragOverlay.tsx';
import ScheduleList from './ScheduleList.tsx';
import StaticGrid from './StaticGrid.tsx';

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    const dndContext = useDndContext();

    const getActiveTableId = useCallback(() => {
      const activeId = dndContext.active?.id;
      if (activeId) {
        return String(activeId).split(':')[0];
      }
      return null;
    }, [dndContext.active?.id]);

    const activeTableId = getActiveTableId();

    return (
      <Box
        position="relative"
        outline={activeTableId === tableId ? '5px dashed' : undefined}
        outlineColor="blue.300"
      >
        {/* 정적 Grid - DnD와 무관하게 렌더링 */}
        <StaticGrid onScheduleTimeClick={onScheduleTimeClick} />

        {/* DnD 오버레이 - DnD 상태 변화만 감지 */}
        <DragOverlay tableId={tableId} />

        {/* 동적 스케줄들 - 스케줄 변화만 감지 */}
        <ScheduleList
          tableId={tableId}
          schedules={schedules}
          onDeleteButtonClick={onDeleteButtonClick}
        />
      </Box>
    );
  }
);

export default ScheduleTable;
