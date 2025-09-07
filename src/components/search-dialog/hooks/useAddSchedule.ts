import { useAutoCallback } from "../../../hooks";
import { Lecture } from "../../../types.ts";
import { parseSchedule } from "../../../utils.ts";
import { useScheduleCommandContext } from "../../schedule-tables";

interface Props {
  tableId?: string;
  onAdd?: () => void;
}

export const useAddSchedule = ({ tableId, onAdd }: Props) => {
  const setSchedulesMap = useScheduleCommandContext();

  return useAutoCallback((lecture: Lecture) => {
    if (!tableId) return;

    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));

    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));

    onAdd?.();
  });
};
