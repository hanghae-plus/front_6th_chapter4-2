import { memo } from 'react';
import { Schedule } from '../../../../types.ts';
import { DragStateProvider } from '../../../../SchedulesDragStateProvider.tsx';
import ScheduleDndProvider from '../../../../ScheduleDndProvider.tsx';
import { Stack } from '@chakra-ui/react/stack';
import { Flex } from '@chakra-ui/react/flex';
import { Heading } from '@chakra-ui/react/typography';
import ScheduleTable from '../ScheduleTable.tsx';
import { SchedulesTableButton } from './SchedulesTableButton.tsx';

export const ScheduleTableContainer = memo(
  ({
    tableId,
    schedules,
    index,
    disabledRemoveButton,
    onSearchOpen,
    onDuplicate,
    onRemove,
    onScheduleTimeClick,
    onDeleteButtonClick,
    onScheduleUpdate,
  }: {
    tableId: string;
    schedules: Schedule[];
    index: number;
    disabledRemoveButton: boolean;
    onSearchOpen: (tableId: string) => void;
    onDuplicate: (tableId: string) => void;
    onRemove: (tableId: string) => void;
    onScheduleTimeClick: (timeInfo: { day?: string; time?: number }) => void; // 변경!
    onDeleteButtonClick: ({ day, time }: { day: string; time: number }) => void; // 변경!
    onScheduleUpdate: (tableId: string, schedules: Schedule[]) => void;
  }) => {
    return (
      <DragStateProvider>
        <ScheduleDndProvider
          tableId={tableId}
          schedules={schedules}
          onScheduleUpdate={onScheduleUpdate}
        >
          <Stack width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">
                시간표 {index + 1}
              </Heading>
              <SchedulesTableButton
                tableId={tableId}
                disabled={disabledRemoveButton}
                onSearch={onSearchOpen}
                onDuplicate={onDuplicate}
                onRemove={onRemove}
              />
            </Flex>
            <ScheduleTable
              schedules={schedules}
              tableId={tableId}
              onScheduleTimeClick={onScheduleTimeClick}
              onDeleteButtonClick={onDeleteButtonClick}
            />
          </Stack>
        </ScheduleDndProvider>
      </DragStateProvider>
    );
  }
);
