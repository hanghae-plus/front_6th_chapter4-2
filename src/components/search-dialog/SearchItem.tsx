import { memo } from "react";
import { Lecture } from "../../types";

export const SearchItem = memo(({ addSchedule, ...lecture }: Lecture & { addSchedule: (lecture: Lecture) => void }) => {
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
        <button onClick={() => addSchedule(lecture)}>추가</button>
      </td>
    </tr>
  );
});

SearchItem.displayName = "SearchItem";
