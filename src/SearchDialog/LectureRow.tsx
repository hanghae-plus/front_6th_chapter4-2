import { Button } from '@chakra-ui/react';
import { memo } from 'react';
import { Lecture } from '../types';

interface Props {
  lecture: Lecture;
  onAdd: (lecture: Lecture) => void;
}

const LectureRow = memo(({ lecture, onAdd }: Props) => {
  return (
    <tr>
      <td width="100px">{lecture.id}</td>
      <td width="50px">{lecture.grade}</td>
      <td width="200px">{lecture.title}</td>
      <td width="50px">{lecture.credits}</td>
      <td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
      <td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
      <td width="80px">
        <Button size="sm" colorScheme="green" onClick={() => onAdd(lecture)}>
          추가
        </Button>
      </td>
    </tr>
  );
});

LectureRow.displayName = 'LectureRow';

export default LectureRow;
