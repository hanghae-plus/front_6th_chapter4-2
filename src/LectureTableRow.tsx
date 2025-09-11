import React from 'react';
import { Button, Td, Tr } from '@chakra-ui/react';
import { Lecture } from './types';

interface LectureTableRowProps {
  lecture: Lecture;
  index: number;
  onAddSchedule: (lecture: Lecture) => void;
}

const LectureTableRow = React.memo<LectureTableRowProps>(
  ({ lecture, index, onAddSchedule }) => {
    return (
      <Tr key={`${lecture.id}-${index}`}>
        <Td width="100px">{lecture.id}</Td>
        <Td width="50px">{lecture.grade}</Td>
        <Td width="200px">{lecture.title}</Td>
        <Td width="50px">{lecture.credits}</Td>
        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
        <Td width="80px">
          <Button size="sm" colorScheme="green" onClick={() => onAddSchedule(lecture)}>
            추가
          </Button>
        </Td>
      </Tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.lecture.id === nextProps.lecture.id &&
      prevProps.lecture.grade === nextProps.lecture.grade &&
      prevProps.lecture.title === nextProps.lecture.title &&
      prevProps.lecture.credits === nextProps.lecture.credits &&
      prevProps.lecture.major === nextProps.lecture.major &&
      prevProps.lecture.schedule === nextProps.lecture.schedule &&
      prevProps.index === nextProps.index
    );
  }
);

export default LectureTableRow;
