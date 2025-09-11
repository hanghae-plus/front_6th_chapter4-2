import { memo, useCallback, useSyncExternalStore } from 'react';
import { Schedule } from '../../../../types.ts';
import { DragStateProvider } from '../../../../SchedulesDragStateProvider.tsx';
import ScheduleDndProvider from '../../../../ScheduleDndProvider.tsx';
import { Stack } from '@chakra-ui/react/stack';
import { Flex } from '@chakra-ui/react/flex';
import { Heading } from '@chakra-ui/react/typography';
import ScheduleTable from '../ScheduleTable.tsx';
import { SchedulesTableButton } from './SchedulesTableButton.tsx';
import { store } from '../../../../store/schedules.store.ts';
import { searchInfoStore } from '../../../../store/searchInfo.store.ts';

interface ScheduleTableContainerProps {
  tableId: string;
  index: number;
  disabledRemoveButton: boolean;
}

export const ScheduleTableContainer = memo(
  ({ tableId, index, disabledRemoveButton }: ScheduleTableContainerProps) => {
    const schedules = useSyncExternalStore(
      callback => store.subscribe(tableId, callback),
      () => store.getTableSchedules(tableId),
      () => store.getTableSchedules(tableId)
    );

    const handleSearchOpen = useCallback(() => {
      searchInfoStore.setSearchInfo({ tableId });
    }, [tableId]);

    const handleScheduleUpdate = useCallback(
      (tableId: string, updatedSchedules: Schedule[]) => {
        store.updateTable(tableId, updatedSchedules);
      },
      []
    );

    const handleScheduleTimeClick = useCallback(
      (timeInfo: { day?: string; time?: number }) => {
        searchInfoStore.setSearchInfo({ tableId, ...timeInfo });
      },
      [tableId]
    );

    return (
      <DragStateProvider>
        <ScheduleDndProvider
          tableId={tableId}
          schedules={schedules}
          onScheduleUpdate={handleScheduleUpdate}
        >
          <Stack width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">
                시간표 {index + 1}
              </Heading>
              <SchedulesTableButton
                tableId={tableId}
                disabled={disabledRemoveButton}
                onSearch={handleSearchOpen}
              />
            </Flex>
            <ScheduleTable
              schedules={schedules}
              tableId={tableId}
              onScheduleTimeClick={handleScheduleTimeClick}
            />
          </Stack>
        </ScheduleDndProvider>
      </DragStateProvider>
    );
  },
  // memo 비교 함수: tableId, index, disabledRemoveButton만 비교
  (prevProps, nextProps) => {
    return (
      prevProps.tableId === nextProps.tableId &&
      prevProps.index === nextProps.index &&
      prevProps.disabledRemoveButton === nextProps.disabledRemoveButton
    );
  }
);
