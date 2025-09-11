import { useScheduleContext } from "../ScheduleContext.tsx";
import { Lecture } from "../types.ts";
import { parseSchedule } from "../utils/index.ts";

export const useScheduleManagement = () => {
  const { setSchedulesMap } = useScheduleContext();

  const addSchedule = (lecture: Lecture, tableId: string) => {
    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));

    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));
  };

  return {
    addSchedule,
  };
};
