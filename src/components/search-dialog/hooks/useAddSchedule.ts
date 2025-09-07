import { useAutoCallback } from "../../../hooks";
import { Lecture } from "../../../types.ts";
import { parseSchedule } from "../../../utils.ts";
import { useScheduleContext } from "../../../ScheduleContext.tsx";

interface Props {
  tableId?: string;
  onAdd?: () => void;
}

export const useAddSchedule = ({ tableId, onAdd }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

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
