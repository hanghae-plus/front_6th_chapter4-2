import { Stack } from '@chakra-ui/react';

import { useCallback } from 'react';
import { useScheduleTableContext } from '../context/ScheduleTableContext.tsx';
import ScheduleTable from './ScheduleTable/index.tsx';
import ScheduleTableHeader from './ScheduleTableHeader.tsx';

interface Props {
  tableId: string;
  index: number;
  disabledRemoveButton: boolean;
  setSearchInfo: (searchInfo: { tableId: string; day?: string; time?: number }) => void;
}

const ScheduleTableWrapper = ({ tableId, index, disabledRemoveButton, setSearchInfo }: Props) => {
  const { schedules, removeSchedule } = useScheduleTableContext();

  const handleDeleteButtonClick = useCallback(
    ({ day, time }: { day: string; time: number }) => {
      removeSchedule(
        schedules.findIndex(schedule => schedule.day === day && schedule.range.includes(time))
      );
    },
    [removeSchedule, schedules]
  );

  const handleScheduleTimeClick = useCallback(
    (timeInfo: { day: string; time: number }) => {
      setSearchInfo({ tableId, ...timeInfo });
    },
    [setSearchInfo, tableId]
  );

  return (
    <Stack width="600px">
      <ScheduleTableHeader
        tableId={tableId}
        index={index}
        setSearchInfo={setSearchInfo}
        disabledRemoveButton={disabledRemoveButton}
      />

      <ScheduleTable
        key={`schedule-table-${index}`}
        schedules={schedules}
        tableId={tableId}
        onScheduleTimeClick={handleScheduleTimeClick}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
    </Stack>
  );
};

export default ScheduleTableWrapper;
