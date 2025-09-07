import { memo } from "react";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Lecture } from "../types.ts";

interface Props {
  visibleLectures: Lecture[];
  filteredLectures: Lecture[];
  onAddSchedule: (lecture: Lecture) => void;
}

// 강의 테이블 컴포넌트
const LectureTable = memo(({ visibleLectures, filteredLectures, onAddSchedule }: Props) => {
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
              <Tr key={`${lecture.id}-${index}`}>
                <Td width="100px">{lecture.id}</Td>
                <Td width="50px">{lecture.grade}</Td>
                <Td width="200px">{lecture.title}</Td>
                <Td width="50px">{lecture.credits}</Td>
                <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }}/>
                <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }}/>
                <Td width="80px">
                  <Button size="sm" colorScheme="green" onClick={() => onAddSchedule(lecture)}>추가</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
});

LectureTable.displayName = 'LectureTable';

export default LectureTable;
