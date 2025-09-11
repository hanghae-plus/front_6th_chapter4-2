import { Flex } from '@chakra-ui/react';
import { useScheduleContext } from './ScheduleContext.tsx';
import TableWrapper from './TableWrapper.tsx';

export const ScheduleTables = () => {
  const { tableIds } = useScheduleContext();

  return (
    <Flex w="full" gap={6} p={6} flexWrap="wrap">
      {tableIds.map((tableId, index) => (
        <TableWrapper key={tableId} tableId={tableId} index={index} />
      ))}
    </Flex>
  );
};
