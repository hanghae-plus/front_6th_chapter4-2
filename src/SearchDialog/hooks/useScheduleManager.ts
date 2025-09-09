import { useScheduleContext } from "../../ScheduleContext.tsx";
import { Lecture } from "../../types.ts";
import { parseSchedule } from "../../utils.ts";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import { SearchInfo } from "../types.ts";

/**
 * 스케줄 추가 로직을 관리하는 커스텀 훅
 * 강의를 시간표에 추가하는 비즈니스 로직을 담당합니다.
 */
export const useScheduleManager = (
  searchInfo: SearchInfo | null,
  onClose: () => void
) => {
  const { setSchedulesMap } = useScheduleContext();

  // 선택한 강의를 시간표에 추가하는 함수
  const addSchedule = useAutoCallback((lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));

    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));

    onClose();
  });

  return {
    addSchedule,
  };
};
