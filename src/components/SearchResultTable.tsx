import { memo } from "react";
import { Box, Text, Table } from "@chakra-ui/react";
import { Lecture } from "../types";
import SearchResultTableHeader from "./SearchResultTableHeader";
import SearchResultTableRow from "./SearchResultTableRow";

interface Props {
  visibleLectures: Lecture[];
  filteredLectures: Lecture[];
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

const SearchResultTable = memo(
  ({
    visibleLectures,
    filteredLectures,
    loaderWrapperRef,
    loaderRef,
  }: Props) => {
    return (
      <>
        <Text align="right">검색결과: {filteredLectures.length}개</Text>
        <Box>
          <SearchResultTableHeader />

          <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
            <Table size="sm">
              <tbody className="chakra-striped-table">
                {visibleLectures.map((lecture, index) => (
                  <SearchResultTableRow
                    key={`${lecture.id}-${index}`}
                    id={lecture.id}
                    grade={lecture.grade}
                    title={lecture.title}
                    credits={lecture.credits}
                    major={lecture.major}
                    schedule={lecture.schedule}
                  />
                ))}
              </tbody>
            </Table>
            <Box ref={loaderRef} h="20px" />
          </Box>
        </Box>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.visibleLectures.length === nextProps.visibleLectures.length &&
      prevProps.filteredLectures.length === nextProps.filteredLectures.length &&
      prevProps.loaderWrapperRef === nextProps.loaderWrapperRef &&
      prevProps.loaderRef === nextProps.loaderRef
    );
  }
);

export default SearchResultTable;
