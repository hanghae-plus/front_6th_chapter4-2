import { Fragment, memo } from 'react';
import { DAY_LABELS } from '../../constants';
import ScheduleTableCell from './ScheduleTableCell';
import TimeLabelCell from './TimeLabelCell';

const TimeColumnHeader = memo(
  ({
    timeIndex,
    time,
    onScheduleTimeClick,
  }: {
    timeIndex: number;
    time: string;
    onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  }) => {
    return (
      <Fragment key={`시간-${timeIndex + 1}`}>
        <TimeLabelCell timeIndex={timeIndex} time={time} />

        {DAY_LABELS.map(day => (
          <ScheduleTableCell
            day={day}
            timeIndex={timeIndex}
            onScheduleTimeClick={onScheduleTimeClick}
          />
        ))}
      </Fragment>
    );
  }
);

export default TimeColumnHeader;
