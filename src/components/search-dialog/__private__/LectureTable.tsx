import { Box, Table } from "@chakra-ui/react";
import { memo, RefObject } from "react";

import { LectureTableRow } from "./LectureTableRow";
import type { Lecture } from "../../../types";

type LectureTableProps = {
  loaderRef: RefObject<HTMLDivElement | null>;
  loaderWrapperRef: RefObject<HTMLDivElement | null>;
  onAddSchedule: (lecture: Lecture) => void;
  visibleLectures: Lecture[];
};

export function LectureTable({ loaderRef, loaderWrapperRef, onAddSchedule, visibleLectures }: LectureTableProps) {
  return (
    <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
      <Table
        size="sm"
        variant="striped"
        sx={{
          "& tbody tr:nth-of-type(odd)": {
            backgroundColor: "gray.100",
          },
          "& td": {
            fontSize: "sm",
            padding: "8px 12px",
          },
          "& button": {
            fontSize: "sm",
            backgroundColor: "green.500",
            color: "white",
            padding: "4px 12px",
            borderRadius: "md",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: "green.600",
            },
          },
        }}
      >
        <tbody>
          {visibleLectures.map((lecture, index) => (
            <LectureTableRow key={`${lecture.id}-${index}`} lecture={lecture} onAddSchedule={onAddSchedule} />
          ))}
        </tbody>
      </Table>
      <Box ref={loaderRef} h="20px" />
    </Box>
  );
}

export const MemoizedLectureTable = memo(LectureTable);
