import { Fragment, memo } from 'react';
import { GridItem } from '@chakra-ui/react/grid';
import { Flex } from '@chakra-ui/react/flex';
import { fill2 } from '../../../../utils/utils.ts';
import { DAY_LABELS } from '../../../../constants/constants.ts';

// 개별 셀 컴포넌트로 분리
const TimeCell = memo(
  ({
    day,
    timeNumber,
    isEvening,
    onTimeClick,
  }: {
    day: string;
    timeNumber: number;
    isEvening: boolean;
    onTimeClick: (day: string, time: number) => void;
  }) => {
    const handleClick = () => {
      onTimeClick(day, timeNumber);
    };
    return (
      <GridItem
        borderWidth="1px 0 0 1px"
        borderColor="gray.300"
        bg={isEvening ? 'gray.100' : 'white'}
        cursor="pointer"
        _hover={{ bg: 'yellow.100' }}
        onClick={handleClick}
      />
    );
  }
);

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
    // console.log(`TimeRow ${timeNumber} 리렌더링`); // 디버깅용
    const isEvening = timeIndex > 17;
    // console.log('TIME ROW RERENDER');
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
          <TimeCell
            key={`${day}-${timeNumber}`}
            day={day}
            timeNumber={timeNumber}
            isEvening={isEvening}
            onTimeClick={onTimeClick}
          />
        ))}
      </Fragment>
    );
  }
);
