import { Box, Table, Tbody } from "@chakra-ui/react";
import React, { memo } from "react";
import SearchItem from "./SearchItem";
import { Lecture } from "./types/type";

const SearchBox = memo(
  ({
    loaderWrapperRef,
    loaderRef,
    visibleLectures,
    addSchedule,
  }: {
    loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
    loaderRef: React.RefObject<HTMLDivElement | null>;
    visibleLectures: Lecture[];
    addSchedule: (lecture: Lecture) => void;
  }) => {
    return (
      <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
        <Table size="sm" variant="striped">
          <Tbody>
            {visibleLectures.map((lecture, index) => (
              <SearchItem key={`${lecture.id}-${index}`} lecture={lecture} addSchedule={addSchedule} />
            ))}
          </Tbody>
        </Table>
        <Box ref={loaderRef} h="20px" />
      </Box>
    );
  },
);

export default SearchBox;
