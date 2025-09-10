import { memo, useCallback, useContext } from "react";
import { Tr, Td, Button } from "@chakra-ui/react";
import { Lecture } from "../types";
import { SearchDialogContext } from "./SearchDialogContext";

interface Props {
  id: string;
  grade: number;
  title: string;
  credits: string;
  major: string;
  schedule: string;
}

const SearchResultTableRow = memo(
  ({ id, grade, title, credits, major, schedule }: Props) => {
    const context = useContext(SearchDialogContext);

    const handleAddClick = useCallback(() => {
      if (!context) return;

      const lecture: Lecture = {
        id,
        grade,
        title,
        credits,
        major,
        schedule,
      };

      context.addSchedule(lecture);
    }, [context, id, grade, title, credits, major, schedule]);

    return (
      <Tr>
        <Td width="100px">{id}</Td>
        <Td width="50px">{grade}</Td>
        <Td width="200px">{title}</Td>
        <Td width="50px">{credits}</Td>
        <Td width="150px" dangerouslySetInnerHTML={{ __html: major }} />
        <Td width="150px" dangerouslySetInnerHTML={{ __html: schedule }} />
        <Td width="80px">
          <Button size="sm" colorScheme="green" onClick={handleAddClick}>
            추가
          </Button>
        </Td>
      </Tr>
    );
  }
);

export default SearchResultTableRow;
