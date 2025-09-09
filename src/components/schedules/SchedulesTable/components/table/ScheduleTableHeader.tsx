import { memo } from 'react';
import { GridItem } from '@chakra-ui/react/grid';
import { Flex } from '@chakra-ui/react/flex';
import { Text } from '@chakra-ui/react/typography';
import { DAY_LABELS } from '../../../../../constants.ts';

export const ScheduleTableHeader = memo(() => (
  <>
    <GridItem key="교시" borderColor="gray.300" bg="gray.100">
      <Flex justifyContent="center" alignItems="center" h="full" w="full">
        <Text fontWeight="bold">교시</Text>
      </Flex>
    </GridItem>
    {DAY_LABELS.map(day => (
      <GridItem key={day} borderLeft="1px" borderColor="gray.300" bg="gray.100">
        <Flex justifyContent="center" alignItems="center" h="full">
          <Text fontWeight="bold">{day}</Text>
        </Flex>
      </GridItem>
    ))}
  </>
));
