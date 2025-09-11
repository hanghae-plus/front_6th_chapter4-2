import { Button, Td, Tr } from "@chakra-ui/react";
import { memo } from "react";
import type { Lecture } from "../../../types";

interface LectureRowProps {
  lecture: Lecture;
  index: number;
  onAddSchedule: (lecture: Lecture) => void;
}

const LectureRow = memo(
  ({ lecture, index, onAddSchedule }: LectureRowProps) => {
    return (
      <Tr key={`${lecture.id}-${index}`}>
        <Td width="100px">{lecture.id}</Td>
        <Td width="50px">{lecture.grade}</Td>
        <Td width="200px">{lecture.title}</Td>
        <Td width="50px">{lecture.credits}</Td>
        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
        <Td width="80px">
          <Button size="sm" colorScheme="green" onClick={() => onAddSchedule(lecture)}>
            추가
          </Button>
        </Td>
      </Tr>
    );
  },
  (prev, next) => {
    return (
      prev.lecture.id === next.lecture.id &&
      prev.lecture.title === next.lecture.title &&
      prev.lecture.grade === next.lecture.grade &&
      prev.lecture.credits === next.lecture.credits &&
      prev.lecture.major === next.lecture.major &&
      prev.lecture.schedule === next.lecture.schedule &&
      prev.index === next.index &&
      prev.onAddSchedule === next.onAddSchedule
    );
  }
);

LectureRow.displayName = "LectureRow";

export default LectureRow;
