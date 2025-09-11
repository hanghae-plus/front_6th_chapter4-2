import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import ScheduleTable from './ScheduleTable.tsx';
import SearchDialog from './SearchDialog.tsx';
import { useState, useMemo, memo } from 'react';
import ScheduleDndProvider from './ScheduleDndProvider.tsx';
import { Schedule } from './types.ts';
import { useAutoCallback } from './hooks';
import { useSchedulesActions, useSchedulesData } from './ScheduleContext.tsx';

export const ScheduleTables = memo(() => {
  const { schedulesMap } = useSchedulesData();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = useMemo(
    () => Object.keys(schedulesMap).length === 1,
    [schedulesMap]
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleWrapper
            key={tableId}
            tableId={tableId}
            schedules={schedules}
            index={index}
            setSearchInfo={setSearchInfo}
            disabledRemoveButton={disabledRemoveButton}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
    </>
  );
});

const ScheduleWrapper = memo(
  ({
    tableId,
    schedules,
    index,
    setSearchInfo,
    disabledRemoveButton,
  }: {
    tableId: string;
    index: number;
    schedules: Schedule[];
    setSearchInfo: (searchInfo: { tableId: string; day?: string; time?: number } | null) => void;
    disabledRemoveButton: boolean;
  }) => {
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

const ScheduleHeader = memo(
  ({
    index,
    onAddButtonClick,
    onDuplicateTableClick,
    onRemoveTableClick,
    disabledRemoveButton,
  }: {
    index: number;
    onAddButtonClick: () => void;
    onDuplicateTableClick: () => void;
    onRemoveTableClick: () => void;
    disabledRemoveButton: boolean;
  }) => {
    return (
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={onAddButtonClick}>
            시간표 추가
          </Button>
          <Button colorScheme="green" mx="1px" onClick={onDuplicateTableClick}>
            복제
          </Button>
          <Button
            colorScheme="green"
            isDisabled={disabledRemoveButton}
            onClick={onRemoveTableClick}
          >
            삭제
          </Button>
        </ButtonGroup>
      </Flex>
    );
  }
);
