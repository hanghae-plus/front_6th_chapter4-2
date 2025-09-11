import { Grid } from '@chakra-ui/react';
import { memo } from 'react';
import { CellSize, DAY_LABELS, 분 } from '../../constants.ts';
import { parseHnM } from '../../utils/utils.ts';
import RowHeader from './RowHeader.tsx';
import TimeColumnHeader from './TimeColumnHeader.tsx';

const TIMES = [
  ...Array(18)
    .fill(0)
    .map((v, k) => v + k * 30 * 분)
    .map(v => `${parseHnM(v)}~${parseHnM(v + 30 * 분)}`),

  ...Array(6)
    .fill(18 * 30 * 분)
    .map((v, k) => v + k * 55 * 분)
    .map(v => `${parseHnM(v)}~${parseHnM(v + 50 * 분)}`),
] as const;

const StaticGrid = memo(
  ({
    onScheduleTimeClick,
  }: {
    onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  }) => {
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
        <RowHeader />

        {TIMES.map((time, timeIndex) => (
          <TimeColumnHeader
            timeIndex={timeIndex}
            time={time}
            onScheduleTimeClick={onScheduleTimeClick}
          />
        ))}
      </Grid>
    );
  }
);

StaticGrid.displayName = 'StaticGrid';

export default StaticGrid;
