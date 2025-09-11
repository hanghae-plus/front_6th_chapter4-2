import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { useScheduleContext } from '../context/ScheduleContext.tsx';
import { ScheduleTableProvider } from '../context/ScheduleTableContext.tsx';
import ScheduleTableDndProvider from '../context/ScheduleTableDndProvider.tsx';
import ScheduleTableWrapper from './ScheduleTableWrapper.tsx';
import SearchDialog from './SearchDialog/index.tsx';

export const ScheduleTables = () => {
  const { tableIds } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = tableIds.length === 1;

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <ScheduleTableProvider key={tableId} tableId={tableId}>
            <ScheduleTableDndProvider>
              <ScheduleTableWrapper
                key={`schedule-table-${index}`}
                tableId={tableId}
                index={index}
                disabledRemoveButton={disabledRemoveButton}
                setSearchInfo={setSearchInfo}
              />
            </ScheduleTableDndProvider>
          </ScheduleTableProvider>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
    </>
  );
};
