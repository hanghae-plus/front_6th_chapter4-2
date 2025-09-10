import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react/popover';

import { Grid } from '@chakra-ui/react/grid';
import { Button } from '@chakra-ui/react/button';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/typography';
import { CellSize, DAY_LABELS, TIMES } from '../../../constants.ts';
import { Schedule } from '../../../types.ts';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ComponentProps, useMemo, useCallback, memo } from 'react';
import { useDragState } from '../../../SchedulesDragStateProvider.tsx';
import { TimeRow } from './components';
import { ScheduleTableHeader } from './components/table/ScheduleTableHeader.tsx';

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

// Grid를 별도 컴포넌트로 분리 - schedules와 무관하게 메모이제이션
const ScheduleGrid = memo(
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

const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    console.log(`ScheduleTable ${tableId} 리렌더링`); // 디버깅용

    // 강의별 색상 매핑 메모이제이션
    const lectureColorMap = useMemo(() => {
      const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
      const colors = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];
      const colorMap = new Map();

      lectures.forEach((lectureId, index) => {
        colorMap.set(lectureId, colors[index % colors.length]);
      });

      return colorMap;
    }, [schedules]);

    const getColor = useCallback(
      (lectureId: string): string => {
        return lectureColorMap.get(lectureId) || '#f9f9f9';
      },
      [lectureColorMap]
    );

    const { activeTableId } = useDragState();

    // TimeRow를 위한 단순한 핸들러 - 메모이제이션 강화
    const handleTimeClick = useCallback(
      (day: string, time: number) => {
        onScheduleTimeClick?.({ day, time });
      },
      [onScheduleTimeClick]
    );

    // DraggableSchedule를 위한 삭제 핸들러
    const createDeleteHandler = useCallback(
      (day: string, time: number) => () => {
        onDeleteButtonClick?.({ day, time });
      },
      [onDeleteButtonClick]
    );

    return (
      <Box
        position="relative"
        outline={activeTableId === tableId ? '5px dashed' : undefined}
        outlineColor="blue.300"
      >
        {/* Grid를 별도 컴포넌트로 분리 */}
        <ScheduleGrid onTimeClick={handleTimeClick} />

        {schedules.map((schedule, index) => (
          <DraggableSchedule
            key={`${tableId}-${schedule.lecture.id}-${index}`}
            id={`${tableId}:${index}`}
            data={schedule}
            bg={getColor(schedule.lecture.id)}
            onDeleteButtonClick={createDeleteHandler(
              schedule.day,
              schedule.range[0]
            )}
          />
        ))}
      </Box>
    );
  }
);

const DraggableSchedule = memo(
  ({
    id,
    data,
    bg,
    onDeleteButtonClick,
  }: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
      onDeleteButtonClick: () => void;
    }) => {
    console.log(`DraggableSchedule ${id} 리렌더링`); // 디버깅용

    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });

    // 위치 계산 메모이제이션
    const position = useMemo(() => {
      const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
      const topIndex = range[0] - 1;
      const size = range.length;

      return {
        left: `${120 + CellSize.WIDTH * leftIndex + 1}px`,
        top: `${40 + (topIndex * CellSize.HEIGHT + 1)}px`,
        width: CellSize.WIDTH - 1 + 'px',
        height: CellSize.HEIGHT * size - 1 + 'px',
      };
    }, [day, range]);
    // transform 메모이제이션
    const transformStyle = useMemo(
      () => CSS.Translate.toString(transform),
      [transform]
    );
    return (
      <Popover isLazy>
        <PopoverTrigger>
          <Box
            position="absolute"
            {...position}
            bg={bg}
            p={1}
            boxSizing="border-box"
            cursor="pointer"
            ref={setNodeRef}
            style={{ willChange: 'transform' }}
            transform={transformStyle}
            {...listeners}
            {...attributes}
          >
            <Text fontSize="sm" fontWeight="bold">
              {lecture.title}
            </Text>
            <Text fontSize="xs">{room}</Text>
          </Box>
        </PopoverTrigger>
        <PopoverContent onClick={event => event.stopPropagation()}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Text>강의를 삭제하시겠습니까?</Text>
            <Button colorScheme="red" size="xs" onClick={onDeleteButtonClick}>
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  },
  (prevProps, nextProps) => {
    // 깊은 비교로 실제 변경사항만 체크
    const prevData = prevProps.data;
    const nextData = nextProps.data;

    const isSame =
      prevProps.id === nextProps.id &&
      prevProps.bg === nextProps.bg &&
      prevData.day === nextData.day &&
      prevData.room === nextData.room &&
      prevData.lecture.id === nextData.lecture.id &&
      prevData.lecture.title === nextData.lecture.title &&
      prevData.range.length === nextData.range.length &&
      prevData.range.every((val, idx) => val === nextData.range[idx]);

    if (!isSame) {
      console.log(`${nextProps.id} 변경 감지:`, {
        day: prevData.day !== nextData.day,
        range: !prevData.range.every((val, idx) => val === nextData.range[idx]),
        lecture: prevData.lecture.id !== nextData.lecture.id,
      });
    }

    return isSame;
  }
);

ScheduleTable.displayName = 'ScheduleTable';
DraggableSchedule.displayName = 'DraggableSchedule';

export default ScheduleTable;
