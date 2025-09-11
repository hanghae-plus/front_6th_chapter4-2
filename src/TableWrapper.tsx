import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import { useState, useCallback } from 'react';
import ScheduleTable from './ScheduleTable.tsx';
import SearchDialog from './SearchDialog.tsx';
import ScheduleDndProvider from './ScheduleDndProvider.tsx';
import { useScheduleContext } from './ScheduleContext.tsx';
import { Schedule } from './types.ts';

interface TableWrapperProps {
  tableId: string;
  index: number;
}

const TableWrapper = ({ tableId, index }: TableWrapperProps) => {
  const { initialSchedulesMap, duplicateTable, removeTable, tableIds } = useScheduleContext();

  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedulesMap[tableId] || []);
  const [searchInfo, setSearchInfo] = useState<{
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = tableIds.length === 1;

  const handleDeleteSchedule = useCallback(({ day, time }: { day: string; time: number }) => {
    setSchedules(prev =>
      prev.filter(schedule => schedule.day !== day || !schedule.range.includes(time))
    );
  }, []);

  const handleScheduleTimeClick = useCallback((timeInfo: { day?: string; time?: number }) => {
    setSearchInfo(timeInfo);
  }, []);

  const handleDuplicate = useCallback(() => {
    duplicateTable(tableId, schedules); // 현재 상태를 복제
  }, [tableId, schedules, duplicateTable]);

  const handleRemove = useCallback(() => {
    removeTable(tableId);
  }, [tableId, removeTable]);

  const handleScheduleAdd = useCallback((newSchedules: Schedule[]) => {
    setSchedules(prev => [...prev, ...newSchedules]);
    setSearchInfo(null);
  }, []);

  return (
    <Stack width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={() => setSearchInfo({})}>
            시간표 추가
          </Button>
          <Button colorScheme="green" mx="1px" onClick={handleDuplicate}>
            복제
          </Button>
          <Button colorScheme="green" isDisabled={disabledRemoveButton} onClick={handleRemove}>
            삭제
          </Button>
        </ButtonGroup>
      </Flex>

      <ScheduleDndProvider tableId={tableId} schedules={schedules} onSchedulesChange={setSchedules}>
        <ScheduleTable
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={handleScheduleTimeClick}
          onDeleteButtonClick={handleDeleteSchedule}
        />
      </ScheduleDndProvider>

      <SearchDialog
        searchInfo={searchInfo ? { tableId, ...searchInfo } : null}
        onClose={() => setSearchInfo(null)}
        onScheduleAdd={handleScheduleAdd}
      />
    </Stack>
  );
};

export default TableWrapper;
