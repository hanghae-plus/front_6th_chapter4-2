import { Flex, GridItem, Text } from '@chakra-ui/react';
import { memo } from 'react';
import { DAY_LABELS } from '../../constants';
import DayHeader from './DayHeader';

const RowHeader = memo(() => {
  return (
    <>
      <GridItem key="교시" borderColor="gray.300" bg="gray.100">
        <Flex justifyContent="center" alignItems="center" h="full" w="full">
          <Text fontWeight="bold">교시</Text>
        </Flex>
      </GridItem>

      {DAY_LABELS.map(day => (
        <DayHeader day={day} />
      ))}
    </>
  );
});

RowHeader.displayName = 'RowHeader';

export default RowHeader;
