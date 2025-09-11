import { memo } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Lecture } from "../../types.ts";
import SearchResultTableHeader from "./SearchResultHeader.tsx";
import SearchResultTableBody from "./SearchResultBody.tsx";

interface Props {
  visibleLectures: readonly Lecture[];
  totalCount: number;
  onAddSchedule: (lecture: Lecture) => void;
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

const SearchResultTable = ({
  visibleLectures,
  totalCount,
  onAddSchedule,
  loaderWrapperRef,
  loaderRef,
}: Props) => {
  return (
    <>
      <Text align="right">검색결과: {totalCount}개</Text>
      <Box>
        <SearchResultTableHeader />
        <SearchResultTableBody
          visibleLectures={visibleLectures}
          onAddSchedule={onAddSchedule}
          loaderWrapperRef={loaderWrapperRef}
          loaderRef={loaderRef}
        />
      </Box>
    </>
  );
};

// 상위 컴포넌트도 메모이제이션 유지
export default memo(SearchResultTable);
