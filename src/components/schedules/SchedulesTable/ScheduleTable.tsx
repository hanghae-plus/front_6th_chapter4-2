import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react/popover';

import { Button } from '@chakra-ui/react/button';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/typography';
import { CellSize, DAY_LABELS } from '../../../constants/constants.ts';
import { Schedule } from '../../../types.ts';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ComponentProps, useMemo, useCallback, memo } from 'react';
import { useActiveTableId } from '../../../SchedulesDragStateProvider.tsx';
import { ScheduleGrid } from './components';
import { store } from '../../../store/externalStore.ts';
interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  // onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = memo(
  ({
    tableId,
    schedules,
    onScheduleTimeClick,
    // onDeleteButtonClick
  }: Props) => {
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

    const activeTableId = useActiveTableId();

    // TimeRow를 위한 단순한 핸들러 - 메모이제이션 강화
    const handleTimeClick = useCallback(
      (day: string, time: number) => {
        onScheduleTimeClick?.({ day, time });
      },
      [onScheduleTimeClick]
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
            // onDeleteButtonClick={onDeleteButtonClick}
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
    // onDeleteButtonClick,
  }: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
      // onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
    }) => {
    // console.log(`DraggableSchedule ${id} 리렌더링`); // 디버깅용

    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });
    const handleDeleteButtonClick = useCallback(
      (tableId: string, { day, time }: { day: string; time: number }) => {
        // console.log(id);
        const lectureId = tableId.split(':')[0];
        store.removeSchedule(lectureId, day, time); // ← 이미 store에 있는 메서드 사용
      },
      []
    );

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
            <Button
              colorScheme="red"
              size="xs"
              onClick={() =>
                handleDeleteButtonClick(id, { day, time: range[0] })
              }
            >
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.bg === nextProps.bg &&
      prevProps.data === nextProps.data // 객체 참조만 비교
    );
  }
);

ScheduleTable.displayName = 'ScheduleTable';
DraggableSchedule.displayName = 'DraggableSchedule';

export default ScheduleTable;
