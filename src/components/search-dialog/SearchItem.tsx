import { memo } from 'react';
import { Button, Td, Tr } from '@chakra-ui/react';
import { Lecture } from '../../types';

interface SearchItemProps extends Lecture {
  addSchedule: (lecture: Lecture) => void;
}

export const SearchItem = memo(
  ({ addSchedule, ...lecture }: SearchItemProps) => {
    const { id, grade, title, credits, major, schedule } = lecture;

    return (
      <Tr>
        <Td width='100px'>{id}</Td>
        <Td width='50px'>{grade}</Td>
        <Td width='200px'>{title}</Td>
        <Td width='50px'>{credits}</Td>
        <Td width='150px' dangerouslySetInnerHTML={{ __html: major }} />
        <Td width='150px' dangerouslySetInnerHTML={{ __html: schedule }} />
        <Td width='80px'>
          <Button
            size='sm'
            colorScheme='green'
            onClick={() => addSchedule(lecture)}
          >
            추가
          </Button>
        </Td>
      </Tr>
    );
  }
);

SearchItem.displayName = 'SearchItem';
