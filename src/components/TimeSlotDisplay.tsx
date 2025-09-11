import { memo } from 'react';
import { Tag, TagCloseButton, TagLabel, Wrap } from '@chakra-ui/react';

interface TimeSlotDisplayProps {
  selectedTimes: number[];
  onRemoveTime: (time: number) => void;
}

// 선택된 시간 태그들을 메모이제이션
export const TimeSlotDisplay = memo(({ selectedTimes, onRemoveTime }: TimeSlotDisplayProps) => (
  <Wrap spacing={1} mb={2}>
    {selectedTimes
      .sort((a, b) => a - b)
      .map((time) => (
        <Tag
          key={time}
          size="sm"
          variant="outline"
          colorScheme="blue"
        >
          <TagLabel>{time}교시</TagLabel>
          <TagCloseButton onClick={() => onRemoveTime(time)} />
        </Tag>
      ))}
  </Wrap>
));

TimeSlotDisplay.displayName = 'TimeSlotDisplay';