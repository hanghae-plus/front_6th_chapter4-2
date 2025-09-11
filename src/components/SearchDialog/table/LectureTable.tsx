import { Table, Tbody } from "@chakra-ui/react";
import { memo } from "react";
import type { Lecture } from "../../../types";
import LectureRow from "./LectureRow";

interface LectureTableProps {
  visibleLectures: Lecture[];
  onAddSchedule: (lecture: Lecture) => void;
}

const LectureTable = memo(
  ({ visibleLectures, onAddSchedule }: LectureTableProps) => {
    return (
      <Table size="sm" variant="striped">
        <Tbody>
          {visibleLectures.map((lecture, index) => (
            <LectureRow key={`${lecture.id}-${index}`} lecture={lecture} index={index} onAddSchedule={onAddSchedule} />
          ))}
        </Tbody>
      </Table>
    );
  },
  (prev, next) => {
    // JSON.stringify로 깊은 비교
    return (
      JSON.stringify(prev.visibleLectures) === JSON.stringify(next.visibleLectures) &&
      prev.onAddSchedule === next.onAddSchedule
    );
  }
);

LectureTable.displayName = "LectureTable";

export default LectureTable;
