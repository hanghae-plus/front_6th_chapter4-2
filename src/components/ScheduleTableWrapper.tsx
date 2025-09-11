import { Button, Flex, Heading, Stack } from '@chakra-ui/react';

import { ButtonGroup } from '@chakra-ui/react';
import { useScheduleContext } from '../context/ScheduleContext';
import { useScheduleTableContext } from '../context/ScheduleTableContext.tsx';
import ScheduleTable from './ScheduleTable.tsx';

interface Props {
  tableId: string;
  index: number;
  disabledRemoveButton: boolean;
  setSearchInfo: (searchInfo: { tableId: string; day?: string; time?: number }) => void;
}

const ScheduleTableWrapper = ({ tableId, index, disabledRemoveButton, setSearchInfo }: Props) => {
  const { duplicateTable, removeTable } = useScheduleContext();
  const { schedules, removeSchedule } = useScheduleTableContext();

  const duplicate = (targetId: string) => duplicateTable(targetId);

  const remove = (targetId: string) => removeTable(targetId);

  const handleDeleteButtonClick = ({ day, time }: { day: string; time: number }) => {
    removeSchedule(
      schedules.findIndex(schedule => schedule.day === day && schedule.range.includes(time))
    );
  };

  return (
    <Stack width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>
            시간표 추가
          </Button>
          <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>
            복제
          </Button>
          <Button
            colorScheme="green"
            isDisabled={disabledRemoveButton}
            onClick={() => remove(tableId)}
          >
            삭제
          </Button>
        </ButtonGroup>
      </Flex>
      <ScheduleTable
        key={`schedule-table-${index}`}
        schedules={schedules}
        tableId={tableId}
        onScheduleTimeClick={timeInfo => setSearchInfo({ tableId, ...timeInfo })}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
    </Stack>
  );
};

export default ScheduleTableWrapper;
