import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import { memo, useCallback, useState } from 'react';
import { useScheduleContext } from '../../ScheduleContext';
import { useScheduleTableIds } from '../../hooks/useScheduleTable';
import { SearchInfo, Schedule } from '../../types';
import { ScheduleActionsReturn } from '../../hooks/useScheduleActions';
import { SearchDialog } from '../search-dialog/SearchDialog';
import { ScheduleTableContainer } from './ScheduleTableContainer';

interface TableStackItemProps {
  tableId: string;
  index: number;
  disabledRemoveButton: boolean;
  schedules: Schedule[];
  actions: ScheduleActionsReturn;
  setSearchInfo: React.Dispatch<React.SetStateAction<SearchInfo | null>>;
}

const TableStackItem = memo(
  ({
    tableId,
    index,
    disabledRemoveButton,
    schedules,
    actions,
    setSearchInfo,
  }: TableStackItemProps) => {
    const handleOpenAdd = useCallback(
      () => setSearchInfo({ tableId }),
      [setSearchInfo, tableId]
    );
    const handleDeleteTable = useCallback(
      () => actions.deleteTable(tableId),
      [actions, tableId]
    );
    const handleDuplicateTable = useCallback(
      () => actions.duplicateTable(tableId),
      [actions, tableId]
    );
    const handleScheduleTimeClick = useCallback(
      (timeInfo: { day: string; time: number }) =>
        setSearchInfo({ tableId, ...timeInfo }),
      [setSearchInfo, tableId]
    );

    return (
      <Stack width='600px'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Heading as='h3' fontSize='lg'>
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size='sm' isAttached>
            <Button colorScheme='green' onClick={handleOpenAdd}>
              시간표 추가
            </Button>
            <Button colorScheme='green' mx='1px' onClick={handleDuplicateTable}>
              복제
            </Button>
            <Button
              colorScheme='green'
              isDisabled={disabledRemoveButton}
              onClick={handleDeleteTable}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleTableContainer
          tableId={tableId}
          schedules={schedules}
          actions={actions}
          onScheduleTimeClick={handleScheduleTimeClick}
        />
      </Stack>
    );
  },
  (prev, next) =>
    prev.tableId === next.tableId &&
    prev.index === next.index &&
    prev.disabledRemoveButton === next.disabledRemoveButton &&
    prev.schedules === next.schedules &&
    prev.actions === next.actions &&
    prev.setSearchInfo === next.setSearchInfo
);

export const ScheduleTables = memo(() => {
  const { schedulesMap, actions } = useScheduleContext();
  const tableIds = useScheduleTableIds(schedulesMap);
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  const disabledRemoveButton = tableIds.length === 1;

  return (
    <>
      <Flex w='full' gap={6} p={6} flexWrap='wrap'>
        {tableIds.map((tableId, index) => (
          <TableStackItem
            key={tableId}
            tableId={tableId}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            schedules={schedulesMap[tableId]}
            actions={actions}
            setSearchInfo={setSearchInfo}
          />
        ))}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
});

ScheduleTables.displayName = 'ScheduleTables';
