import { memo } from "react";
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Lecture } from "../types";

interface LectureRowProps {
  lecture: Lecture;
  onAddSchedule: (lecture: Lecture) => void;
}

const LectureRow = memo(({ lecture, onAddSchedule }: LectureRowProps) => (
  <Tr>
    <Td width="100px">{lecture.id}</Td>
    <Td width="50px">{lecture.grade}</Td>
    <Td width="200px">{lecture.title}</Td>
    <Td width="50px">{lecture.credits}</Td>
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
    <Td width="80px">
      <Button
        size="sm"
        colorScheme="green"
        onClick={() => onAddSchedule(lecture)}>
        추가
      </Button>
    </Td>
  </Tr>
));

LectureRow.displayName = "LectureRow";

interface LectureTableProps {
  visibleLectures: Lecture[];
  onAddSchedule: (lecture: Lecture) => void;
  loaderWrapperRef: React.RefObject<HTMLDivElement>;
  loaderRef: React.RefObject<HTMLDivElement>;
}

const LectureTable = memo(
  ({
    visibleLectures,
    onAddSchedule,
    loaderWrapperRef,
    loaderRef,
  }: LectureTableProps) => {
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
              {visibleLectures.map((lecture, index) => (
                <LectureRow
                  key={`${lecture.id}-${index}`}
                  lecture={lecture}
                  onAddSchedule={onAddSchedule}
                />
              ))}
            </Tbody>
          </Table>
          <Box ref={loaderRef} h="20px" />
        </Box>
      </Box>
    );
  }
);

LectureTable.displayName = "LectureTable";

export default LectureTable;
