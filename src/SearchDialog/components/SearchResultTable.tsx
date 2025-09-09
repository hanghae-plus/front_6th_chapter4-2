import { Box, Table, Tbody, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { Lecture } from "../../types.ts";
import SearchItem from "./SearchItem.tsx";

interface SearchResultTableProps {
  lectures: Lecture[];
  totalCount: number;
  addSchedule: (lecture: Lecture) => void;
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 검색 결과를 테이블 형태로 표시하는 컴포넌트
 * 헤더, 검색 결과 수, 강의 목록, 무한 스크롤 로더를 포함합니다.
 */
const SearchResultTable = ({
  lectures,
  totalCount,
  addSchedule,
  loaderWrapperRef,
  loaderRef,
}: SearchResultTableProps) => {
  return (
    <>
      <Text align="right">검색결과: {totalCount}개</Text>
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
                  {...lecture}
                  addSchedule={addSchedule}
                />
              ))}
            </Tbody>
          </Table>
          <Box ref={loaderRef} h="20px" />
        </Box>
      </Box>
    </>
  );
};

export default SearchResultTable;
