import { Box, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { Lecture } from './types';
import { memo } from 'react';

interface LectureTableProps {
  lectures: Lecture[];
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
  addSchedule: (lecture: Lecture) => void;
}

export function LectureTable({
  lectures,
  loaderWrapperRef,
  loaderRef,
  addSchedule,
}: LectureTableProps) {
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

      <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
        <Table size="sm" variant="striped">
          <Tbody>
            {lectures.map((lecture, index) => (
              <SearchItem
                key={`${lecture.id}-${index}`}
                addSchedule={addSchedule}
                lecture={lecture}
              />
            ))}
          </Tbody>
        </Table>
        <Box ref={loaderRef} h="20px" />
      </Box>
    </Box>
  );
}

const SearchItem = memo(
  ({ addSchedule, lecture }: { addSchedule: (lecture: Lecture) => void; lecture: Lecture }) => {
    const { id, grade, title, credits, major, schedule } = lecture;

    return (
      <Tr>
        <Td width="100px">{id}</Td>
        <Td width="50px">{grade}</Td>
        <Td width="200px">{title}</Td>
        <Td width="50px">{credits}</Td>
        <Td width="150px" dangerouslySetInnerHTML={{ __html: major }} />
        <Td width="150px" dangerouslySetInnerHTML={{ __html: schedule }} />
        <Td width="80px">
          <Button size="sm" colorScheme="green" onClick={() => addSchedule(lecture)}>
            추가
          </Button>
        </Td>
      </Tr>
    );
  }
);
