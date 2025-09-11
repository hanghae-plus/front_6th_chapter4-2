import { Button, Td, Tr } from "@chakra-ui/react";
import { Lecture } from "../../types";
import { memo } from "react";

export const SearchItem = memo(
  ({
    addSchedule,
    lecture,
  }: {
    addSchedule: (lecture: Lecture) => void;
    lecture: Lecture;
  }) => {
    return (
      <Tr key={`${lecture.id}`}>
        <Td width="100px">{lecture.id}</Td>
        <Td width="50px">{lecture.grade}</Td>
        <Td width="200px">{lecture.title}</Td>
        <Td width="50px">{lecture.credits}</Td>
        <Td
          width="150px"
          dangerouslySetInnerHTML={{ __html: lecture.major }}
        />
        <Td
          width="150px"
          dangerouslySetInnerHTML={{ __html: lecture.schedule }}
        />
        <Td width="80px">
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => addSchedule(lecture)}
          >
            추가
          </Button>
        </Td>
      </Tr>
    );
  }
);
