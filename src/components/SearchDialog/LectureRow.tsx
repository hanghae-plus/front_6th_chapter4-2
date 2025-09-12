import { memo } from "react";
import { Lecture } from "../../types";

interface LectureRowProps {
  lecture: Lecture;
  addSchedule: (lecture: Lecture) => void;
}
const LectureRow = memo(({ lecture, addSchedule }: LectureRowProps) => {
  return (
    <tr>
      <td width="100px">{lecture.id}</td>
      <td width="50px">{lecture.grade}</td>
      <td width="200px">{lecture.title}</td>
      <td width="50px">{lecture.credits}</td>
      <td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
      <td
        width="150px"
        dangerouslySetInnerHTML={{ __html: lecture.schedule }}
      />
      <td width="80px">
        <button onClick={() => addSchedule(lecture)}>추가</button>
      </td>
    </tr>
  );
});

LectureRow.displayName = "LectureRow";

export default LectureRow;
