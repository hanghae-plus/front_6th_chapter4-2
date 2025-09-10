// Grid를 별도 컴포넌트로 분리 - schedules와 무관하게 메모이제이션
import { memo } from 'react';
import { Grid } from '@chakra-ui/react/grid';
import { ScheduleTableHeader } from './ScheduleTableHeader.tsx';
import {
  CellSize,
  DAY_LABELS,
  TIMES,
} from '../../../../constants/constants.ts';
import { TimeRow } from './TimeRow.tsx';

export const ScheduleGrid = memo(
  ({ onTimeClick }: { onTimeClick: (day: string, time: number) => void }) => {
    console.log('ScheduleGrid 리렌더링'); // 디버깅용

    return (
      <Grid
        templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
        templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
        bg="white"
        fontSize="sm"
        textAlign="center"
        outline="1px solid"
        outlineColor="gray.300"
      >
        <ScheduleTableHeader />
        {TIMES.map((time, timeIndex) => {
          const timeNumber = timeIndex + 1;
          return (
            <TimeRow
              key={timeNumber}
              time={time}
              timeIndex={timeIndex}
              timeNumber={timeNumber}
              onTimeClick={onTimeClick}
            />
          );
        })}
      </Grid>
    );
  }
);
