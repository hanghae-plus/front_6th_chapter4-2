import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { memo } from 'react';
import { CellSize, DAY_LABELS } from '../../constants';
import { useScheduleDrag } from '../../hooks/useScheduleDrag';
import { Schedule } from '../../types';

interface DraggableScheduleProps {
  id: string;
  data: Schedule;
  bg: string;
  onDeleteButtonClick: () => void;
}

export const DraggableSchedule = memo(
  ({ id, data, bg, onDeleteButtonClick }: DraggableScheduleProps) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });

    const tableId = id.split(':')[0];
    const isThisTableDragging = useScheduleDrag(tableId);

    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    return (
      <Popover>
        <PopoverTrigger>
          <Box
            position='absolute'
            left={`${120 + CellSize.WIDTH * leftIndex + 1}px`}
            top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
            width={CellSize.WIDTH - 1 + 'px'}
            height={CellSize.HEIGHT * size - 1 + 'px'}
            bg={bg}
            p={1}
            boxSizing='border-box'
            cursor='pointer'
            ref={setNodeRef}
            transform={CSS.Translate.toString(transform)}
            opacity={isThisTableDragging ? 0.8 : 1}
            zIndex={isThisTableDragging ? 1000 : 1}
            {...listeners}
            {...attributes}
          >
            <Text fontSize='sm' fontWeight='bold'>
              {lecture.title}
            </Text>
            <Text fontSize='xs'>{room}</Text>
          </Box>
        </PopoverTrigger>
        <PopoverContent onClick={(event) => event.stopPropagation()}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Text>강의를 삭제하시겠습니까?</Text>
            <Button colorScheme='red' size='xs' onClick={onDeleteButtonClick}>
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
);

DraggableSchedule.displayName = 'DraggableSchedule';
