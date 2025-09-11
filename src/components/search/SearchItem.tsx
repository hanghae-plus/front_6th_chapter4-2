import { memo } from "react";
import { Lecture } from "../../types";
import { Button, Td, Tr } from "@chakra-ui/react";

export const SearchItem = memo(
  ({
    addSchedule,
    ...lecture
  }: Lecture & { addSchedule: (lecture: Lecture) => void }) => {
    const { id, grade, title, credits, major, schedule } = lecture;
    return (
      <Tr>
        <Td width="100px">{id}</Td>
        <Td width="50px">{grade}</Td>
        <Td width="200px">{title}</Td>
        <Td width="50px">{credits}</Td>
        <Td width="150px" dangerouslySetInnerHTML={{ __html: major }} />
        <Td width="150px" dangerouslySetInnerHTML={{ __html: schedule }} />
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

SearchItem.displayName = "SearchItem";
