import { memo } from "react";
import { Box, Table, Tbody } from "@chakra-ui/react";
import { Lecture } from "../../types.ts";
import SearchResultTableRow from "./SearchResultTableRow.tsx";

interface Props {
  visibleLectures: readonly Lecture[];
  onAddSchedule: (lecture: Lecture) => void;
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

const SearchResultTableBody = ({
  visibleLectures,
  onAddSchedule,
  loaderWrapperRef,
  loaderRef,
}: Props) => {
  return (
    <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
      <Table size="sm" variant="striped">
        <Tbody>
          {visibleLectures.map((lecture) => (
            <SearchResultTableRow
              key={lecture.id}
              lecture={lecture}
              onAddSchedule={onAddSchedule}
            />
          ))}
        </Tbody>
      </Table>
      <Box ref={loaderRef} h="20px" />
    </Box>
  );
};

export default memo(SearchResultTableBody, (prevProps, nextProps) => {
  return (
    prevProps.visibleLectures === nextProps.visibleLectures &&
    prevProps.onAddSchedule === nextProps.onAddSchedule
  );
});
