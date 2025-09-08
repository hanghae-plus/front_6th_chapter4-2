import { memo } from "react";
import { Box } from "@chakra-ui/react";
import { Lecture } from "../types";
import SearchResultTableHeader from "./SearchResultTableHeader";
import SearchResultTableBody from "./SearchResultTableBody";

interface Props {
  visibleLectures: readonly Lecture[];
  onAddSchedule: (lecture: Lecture) => void;
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

const SearchResultTable = ({ visibleLectures, onAddSchedule, loaderWrapperRef, loaderRef }: Props) => {
  return (
    <Box>
      <SearchResultTableHeader />
      <SearchResultTableBody
        visibleLectures={visibleLectures}
        onAddSchedule={onAddSchedule}
        loaderWrapperRef={loaderWrapperRef}
        loaderRef={loaderRef}
      />
    </Box>
  );
};

// 상위 컴포넌트도 메모이제이션 유지
export default memo(SearchResultTable);
