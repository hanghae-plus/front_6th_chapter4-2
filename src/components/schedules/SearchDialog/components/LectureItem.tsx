import { memo } from 'react';
import { Lecture } from '../../../../types.ts';
import { Tr } from '@chakra-ui/react/table';

export const LectureItem = memo(
  ({
    onAddSchedule,
    ...lecture
  }: Lecture & {
    onAddSchedule: (lecture: Lecture) => void;
  }) => {
    const { id, grade, title, credits, major, schedule } = lecture;

    return (
      <Tr>
        <td style={{ width: '100px' }}>{id}</td>
        <td style={{ width: '50px' }}>{grade}</td>
        <td style={{ width: '200px' }}>{title}</td>
        <td style={{ width: '50px' }}>{credits}</td>
        <td style={{ width: '150px' }}>{major}</td>
        <td style={{ width: '150px' }}>{schedule}</td>
        <td style={{ width: '80px' }}>
          <button onClick={() => onAddSchedule(lecture)}>추가</button>
        </td>
      </Tr>
    );
  }
);
