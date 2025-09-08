import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react/table';
import { Box } from '@chakra-ui/react/box';
import { Button } from '@chakra-ui/react/button';

import { Lecture } from '../types.ts';
import { memo } from 'react';

interface Props {
  visibleLectures: Lecture[];
  filteredLectures: Lecture[];
  onAddSchedule: (lecture: Lecture) => void;
}

const SearchItem = memo(
  ({
    onAddSchedule,
    ...lecture
  }: Lecture & {
    onAddSchedule: (lecture: Lecture) => void;
  }) => {
    const stripHtml = (html: string) => {
      return html?.replace(/<[^>]*>/g, '').trim();
    };
    const { id, grade, title, credits, major, schedule } = lecture;

    return (
      <Tr>
        <Td width="100px">{id}</Td>
        <Td width="50px">{grade}</Td>
        <Td width="200px">{title}</Td>
        <Td width="50px">{credits}</Td>
        <Td width="150px">{stripHtml(major)}</Td>
        <Td width="150px">{stripHtml(schedule)}</Td>
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
  }
);

// 강의 테이블 컴포넌트
const LectureTable = ({ visibleLectures, onAddSchedule }: Props) => {
  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th width="100px">과목코드</Th>
            <Th width="50px">학년</Th>
            <Th width="200px">과목명</Th>
            <Th width="50px">학점</Th>
            <Th width="150px">전공</Th>
            <Th width="150px">시간</Th>
            <Th width="80px"></Th>
          </Tr>
        </Thead>
      </Table>

      <Box overflowY="auto" maxH="500px">
        <Table size="sm" variant="striped">
          <Tbody>
            {visibleLectures.map((lecture, index) => (
              <SearchItem
                key={`${lecture.id}-${index}`}
                {...lecture}
                onAddSchedule={onAddSchedule}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

LectureTable.displayName = 'LectureTable';

export default LectureTable;
