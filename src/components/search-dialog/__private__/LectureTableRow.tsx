import { memo, useCallback } from "react";

import type { Lecture } from "../../../types";

type LectureTableRowProps = {
  lecture: Lecture;
  onAddSchedule: (lecture: Lecture) => void;
};

export function LectureTableRow({ lecture, onAddSchedule }: LectureTableRowProps) {
  const handleAddSchedule = useCallback(() => {
    onAddSchedule(lecture);
  }, [lecture, onAddSchedule]);

  return (
    <tr>
      <td style={{ width: "100px" }}>{lecture.id}</td>
      <td style={{ width: "50px" }}>{lecture.grade}</td>
      <td style={{ width: "200px" }}>{lecture.title}</td>
      <td style={{ width: "50px" }}>{lecture.credits}</td>
      <td style={{ width: "150px" }} dangerouslySetInnerHTML={{ __html: lecture.major }} />
      <td style={{ width: "150px" }} dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
      <td style={{ width: "80px" }}>
        <button onClick={handleAddSchedule}>추가</button>
      </td>
    </tr>
  );
}

export const MemoizedLectureTableRow = memo(LectureTableRow);
