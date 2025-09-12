import { Stack } from '@chakra-ui/react';
import { memo } from 'react';
import { Schedule } from '../../types';
import { useAutoCallback } from '../../hooks';
import { useSchedulesActions } from '../../contexts';
import { ScheduleDndProvider } from '../../contexts/ScheduleDndProvider';
import { ScheduleTable } from './ScheduleTable';
import { ScheduleHeader } from './ScheduleHeader';

interface Props {
  tableId: string;
  index: number;
  schedules: Schedule[];
  setSearchInfo: (searchInfo: { tableId: string; day?: string; time?: number } | null) => void;
  disabledRemoveButton: boolean;
}

const ScheduleWrapper = memo(
  ({ tableId, schedules, index, setSearchInfo, disabledRemoveButton }: Props) => {
    const { setSchedulesMap } = useSchedulesActions();

    const handleDuplicateTable = useAutoCallback(() => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[tableId]],
      }));
    });

    const handleRemoveTable = useAutoCallback(() => {
      setSchedulesMap((prev) => {
        delete prev[tableId];
        return { ...prev };
      });
    });

    const handleAddButtonClick = useAutoCallback(() => {
      setSearchInfo({ tableId });
    });

    return (
      <Stack key={tableId} width="600px">
        <ScheduleHeader
          index={index}
          onAddButtonClick={handleAddButtonClick}
          onDuplicateTableClick={handleDuplicateTable}
          onRemoveTableClick={handleRemoveTable}
          disabledRemoveButton={disabledRemoveButton}
        />

        <ScheduleDndProvider draggedTableId={tableId}>
          <ScheduleTable
            key={`schedule-table-${index}`}
            schedules={schedules}
            tableId={tableId}
            setSearchInfo={setSearchInfo}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  }
);

ScheduleWrapper.displayName = 'ScheduleWrapper';

export { ScheduleWrapper };
