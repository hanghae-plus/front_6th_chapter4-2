import { memo, useCallback } from "react";
import { Button, Td, Tr } from "@chakra-ui/react";
import { Lecture } from "../../types.ts";

interface LectureRowProps {
  lecture: Lecture & {
    parsedSchedule: { day: string; range: number[]; room: string }[];
    titleLower: string;
    idLower: string;
  };
  index: number;
  onAddSchedule: (
    lecture: Lecture & {
      parsedSchedule: { day: string; range: number[]; room: string }[];
      titleLower: string;
      idLower: string;
    },
  ) => void;
}

// 강의 행 컴포넌트 - 개별 메모이제이션
const LectureRow = ({ lecture, index, onAddSchedule }: LectureRowProps) => {
  const handleAdd = useCallback(() => {
    onAddSchedule(lecture);
  }, [lecture, onAddSchedule]);

  return (
    <Tr key={`${lecture.id}-${index}`}>
      <Td width="100px">{lecture.id}</Td>
      <Td width="50px">{lecture.grade}</Td>
      <Td width="200px">{lecture.title}</Td>
      <Td width="50px">{lecture.credits}</Td>
      <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
      <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
      <Td width="80px">
        <Button size="sm" colorScheme="green" onClick={handleAdd}>
          추가
        </Button>
      </Td>
    </Tr>
  );
};

LectureRow.displayName = "LectureRow";

export default memo(LectureRow);
