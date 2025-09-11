import { memo } from "react";
import { Button} from "@chakra-ui/react";
import { Lecture } from "../../types";

interface SearchItemProps extends Lecture {
  addSchedule: (lecture: Lecture) => void;
}

export const SearchItem = memo(
  ({ addSchedule, ...lecture }: SearchItemProps) => {
    const { id, grade, title, credits, major, schedule } = lecture;

    return (
      <tr>
        <td width="100px">{id}</td>
        <td width="50px">{grade}</td>
        <td width="200px">{title}</td>
        <td width="50px">{credits}</td>
        <td width="150px" dangerouslySetInnerHTML={{ __html: major }} />
        <td width="150px" dangerouslySetInnerHTML={{ __html: schedule }} />
        <td width="80px">
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => addSchedule(lecture)}
          >
            추가
          </Button>
        </td>
      </tr>
    );
  },
);

SearchItem.displayName = "SearchItem";
