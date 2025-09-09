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

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

function ScheduleHeader() {
  return null;
}

const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
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

    // const dndContext = useDndContext();
    const { activeTableId } = useDragState();

    // 핸들러 함수들 메모이제이션 - 고차함수로 최적화
    const createTimeClickHandler = useCallback(
      (day: string, time: number) => () => {
        onScheduleTimeClick?.({ day, time });
      },
      [onScheduleTimeClick]
    );

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
        <Grid
          templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
          templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
          bg="white"
          fontSize="sm"
          textAlign="center"
          outline="1px solid"
          outlineColor="gray.300"
        >
          <ScheduleHeader />
          {TIMES.map((time, timeIndex) => {
            const timeNumber = timeIndex + 1;
            return (
              <TimeRow
                key={timeNumber}
                time={time}
                timeIndex={timeIndex}
                timeNumber={timeNumber}
                onTimeClick={createTimeClickHandler}
              />
            );
          })}
        </Grid>

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
  }
);

ScheduleTable.displayName = 'ScheduleTable';
DraggableSchedule.displayName = 'DraggableSchedule';

export default ScheduleTable;
