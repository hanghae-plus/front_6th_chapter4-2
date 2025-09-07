import { memo } from "react";
import { Button, Td, Tr } from "@chakra-ui/react";
import { Lecture } from "../types";

interface Props {
  lecture: Lecture;
  onAddSchedule: (lecture: Lecture) => void;
}

const SearchResultTableRow = ({ lecture, onAddSchedule }: Props) => {
  return (
    <Tr>
      <Td width="100px">{lecture.id}</Td>
      <Td width="50px">{lecture.grade}</Td>
      <Td width="200px">{lecture.title}</Td>
      <Td width="50px">{lecture.credits}</Td>
      <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
      <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
      <Td width="80px">
        <Button 
          size="sm" 
          colorScheme="green" 
          onClick={() => onAddSchedule(lecture)}
        >
          추가
        </Button>
      </Td>
    </Tr>
  );
};

// lecture 객체의 각 필드를 직접 비교
export default memo(SearchResultTableRow, (prevProps, nextProps) => {
  const prevLecture = prevProps.lecture;
  const nextLecture = nextProps.lecture;
  
  return (
    prevLecture.id === nextLecture.id &&
    prevLecture.title === nextLecture.title &&
    prevLecture.grade === nextLecture.grade &&
    prevLecture.credits === nextLecture.credits &&
    prevLecture.major === nextLecture.major &&
    prevLecture.schedule === nextLecture.schedule &&
    prevProps.onAddSchedule === nextProps.onAddSchedule
  );
});
