import { memo, useMemo } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Lecture } from "../types";
import SearchResultTableHeader from "./SearchResultTableHeader";
import SearchResultTableRow from "./SearchResultTableRow";

interface Props {
  visibleLectures: Lecture[];
  filteredLectures: Lecture[];
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

// Chakra UI Table size="sm" 스타일
const TABLE_STYLE = {
  width: "100%",
  borderCollapse: "collapse" as const,
  fontSize: "var(--chakra-fontSizes-sm, 0.875rem)",
};

const SearchResultTable = memo(
  ({
    visibleLectures,
    filteredLectures,
    loaderWrapperRef,
    loaderRef,
  }: Props) => {
    const tableStyle = useMemo(() => TABLE_STYLE, []);

    return (
      <>
        <Text align="right">검색결과: {filteredLectures.length}개</Text>
        <Box className="mt-4">
          <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
            <table style={tableStyle}>
              <SearchResultTableHeader />
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
            </table>
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
