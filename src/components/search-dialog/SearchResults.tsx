import { memo } from "react";
import { Box, Table, Tbody, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { Lecture } from "../../types";
import { SearchItem } from "./SearchItem";

interface SearchResultsProps {
  filteredLectures: Lecture[];
  visibleLectures: Lecture[];
  addSchedule: (lecture: Lecture) => void;
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

const ResultsCount = memo(({ count }: { count: number }) => (
  <Text align="right">검색결과: {count}개</Text>
));
ResultsCount.displayName = "ResultsCount";

const TableHeader = memo(() => (
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
));
TableHeader.displayName = "TableHeader";

const SearchList = memo(
  ({ visibleLectures, addSchedule }: { visibleLectures: Lecture[]; addSchedule: (lecture: Lecture) => void }) => (
    <Table size="sm" variant="striped">
      <Tbody>
        {visibleLectures.map((lecture, index) => (
          <SearchItem
            key={`${lecture.id}-${lecture.title}-${lecture.major}-${index}`}
            addSchedule={addSchedule}
            {...lecture}
          />
        ))}
      </Tbody>
    </Table>
  ),
  (prevProps, nextProps) =>
    prevProps.visibleLectures === nextProps.visibleLectures &&
    prevProps.addSchedule === nextProps.addSchedule
);
SearchList.displayName = "SearchList";

export const SearchResults = memo(
  ({
    filteredLectures,
    visibleLectures,
    addSchedule,
    loaderWrapperRef,
    loaderRef,
  }: SearchResultsProps) => {
    return (
      <>
        <ResultsCount count={filteredLectures.length} />
        <Box>
          <TableHeader />
          <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
            <SearchList visibleLectures={visibleLectures} addSchedule={addSchedule} />
            <Box ref={loaderRef} h="20px" />
          </Box>
        </Box>
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.filteredLectures === nextProps.filteredLectures &&
    prevProps.visibleLectures === nextProps.visibleLectures &&
    prevProps.addSchedule === nextProps.addSchedule
);

SearchResults.displayName = "SearchResults";
