import { Button, Td, Tr } from "@chakra-ui/react";
import { memo } from "react";
import type { Lecture } from "../../types/types";

interface Props extends Lecture {
  index: number;
  addSchedule: (lecture: Lecture) => void;
}

export const LectureRow = memo(({ index, addSchedule, ...lecture }: Props) => {
  const { id, grade, title, credits, major, schedule } = lecture;

  return (
    <Tr>
      <Td width="100px">{id}</Td>
      <Td width="50px">{grade}</Td>
      <Td width="200px">{title}</Td>
      <Td width="50px">{credits}</Td>
      <Td width="150px">{major.replace(/<p>/gi, " ")}</Td>
      <Td width="150px">{schedule}</Td>
      <Td width="80px">
        <Button size="sm" colorScheme="green" onClick={() => addSchedule(lecture)}>
          추가
        </Button>
      </Td>
    </Tr>
  );
});
