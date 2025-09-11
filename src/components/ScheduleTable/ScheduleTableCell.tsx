import { GridItem } from '@chakra-ui/react';
import { memo } from 'react';

const ScheduleTableCell = memo(
  ({
    day,
    timeIndex,
    onScheduleTimeClick,
  }: {
    day: string;
    timeIndex: number;
    onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  }) => {
    return (
      <GridItem
        key={`${day}-${timeIndex + 2}`}
        borderWidth="1px 0 0 1px"
        borderColor="gray.300"
        bg={timeIndex > 17 ? 'gray.100' : 'white'}
        cursor="pointer"
        _hover={{ bg: 'yellow.100' }}
        onClick={() => onScheduleTimeClick?.({ day, time: timeIndex + 1 })}
      />
    );
  }
);

ScheduleTableCell.displayName = 'ScheduleTableCell';

export default ScheduleTableCell;
