import { Fragment, memo } from 'react';
import { GridItem } from '@chakra-ui/react/grid';
import { Flex } from '@chakra-ui/react/flex';
import { fill2 } from '../../../../utils.ts';
import { DAY_LABELS } from '../../../../constants.ts';

export const TimeRow = memo(
  ({
    time,
    timeIndex,
    timeNumber,
    onTimeClick,
  }: {
    time: string;
    timeIndex: number;
    timeNumber: number;
    onTimeClick: (day: string, timeNumber: number) => void;
  }) => {
    const isEvening = timeIndex > 17;

    return (
      <Fragment key={`시간-${timeNumber}`}>
        <GridItem
          borderTop="1px solid"
          borderColor="gray.300"
          bg={isEvening ? 'gray.200' : 'gray.100'}
        >
          <Flex justifyContent="center" alignItems="center" h="full">
            <span style={{ fontSize: '12px' }}>
              {fill2(timeNumber)} ({time})
            </span>
          </Flex>
        </GridItem>
        {DAY_LABELS.map(day => (
          <GridItem
            key={`${day}-${timeNumber + 1}`}
            borderWidth="1px 0 0 1px"
            borderColor="gray.300"
            bg={isEvening ? 'gray.100' : 'white'}
            cursor="pointer"
            _hover={{ bg: 'yellow.100' }}
            onClick={() => onTimeClick(day, timeNumber)}
          />
        ))}
      </Fragment>
    );
  }
);
