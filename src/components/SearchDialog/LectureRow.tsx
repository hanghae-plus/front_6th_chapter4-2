import { Button, Td, Tr } from '@chakra-ui/react';
import { memo } from 'react';
import type { Lecture } from '../../types';
import { lectureRowComparison } from '../../utils/memoComparison';

interface LectureRowProps {
  lecture: Lecture;
  index: number;
  onAddSchedule: (lecture: Lecture) => void;
}

const LectureRow = memo(
  ({ lecture, index, onAddSchedule }: LectureRowProps) => {
    return (
      <Tr key={`${lecture.id}-${index}`}>
        <Td width="100px">{lecture.id}</Td>
        <Td width="50px">{lecture.grade}</Td>
        <Td width="200px">{lecture.title}</Td>
        <Td width="50px">{lecture.credits}</Td>
        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
        <Td
          width="150px"
          dangerouslySetInnerHTML={{ __html: lecture.schedule }}
        />
        <Td width="80px">
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => onAddSchedule(lecture)}
          >
            추가
          </Button>
        </Td>
      </Tr>
    );
  },
  lectureRowComparison,
);

LectureRow.displayName = 'LectureRow';

export default LectureRow;
