import {
  Box,
  Table,
  Text,
  Th,
  Thead,
  Tbody,
  Td,
  Button,
  Tr,
} from "@chakra-ui/react";
import { memo } from "react";
import { Lecture } from "../types";

interface Props {
  filteredLectures: Lecture[];
  visibleLectures: Lecture[];
  loaderRef: React.RefObject<HTMLDivElement | null>;
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  handleAddSchedule: (lecture: Lecture) => void;
}

function ResultTable({
  filteredLectures,
  visibleLectures,
  loaderRef,
  loaderWrapperRef,
  handleAddSchedule,
}: Props) {
  return (
    <>
      <Text align="right">검색결과: {filteredLectures.length}개</Text>
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
                <Tr key={`${lecture.id}-${index}`}>
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
                      onClick={() => handleAddSchedule(lecture)}
                    >
                      추가
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Box ref={loaderRef} h="20px" />
        </Box>
      </Box>
    </>
  );
}

export default memo(ResultTable);
