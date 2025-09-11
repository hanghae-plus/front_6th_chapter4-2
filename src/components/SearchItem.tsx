import { memo } from 'react';
import { Button, Tr, Td } from '@chakra-ui/react';
import { Lecture } from '../types.ts';

interface SearchItemProps {
  lecture: Lecture;
  onAdd: (lecture: Lecture) => void;
}

// 메모이제이션된 SearchItem 컴포넌트
export const SearchItem = memo(({ lecture, onAdd }: SearchItemProps) => (
  <Tr>
    <Td width="100px">{lecture.id}</Td>
    <Td width="50px">{lecture.grade}</Td>
    <Td width="200px">{lecture.title}</Td>
    <Td width="50px">{lecture.credits}</Td>
    <Td
      width="150px"
      dangerouslySetInnerHTML={{ __html: lecture.major }}
    />
    <Td
      width="150px"
      dangerouslySetInnerHTML={{ __html: lecture.schedule }}
    />
    <Td width="80px">
      <Button
        size="sm"
        colorScheme="green"
        onClick={() => onAdd(lecture)}
      >
        추가
      </Button>
    </Td>
  </Tr>
));

SearchItem.displayName = 'SearchItem';