import { memo } from "react";
import { Schedule } from "../../types";
import { useSchedulesActions } from "../../contexts";
import { useAutoCallback } from "../../hooks";
import OriginalScheduleTable from "../../ScheduleTable";

interface Props {
  schedules: Schedule[];
  tableId: string;
  setSearchInfo: (
    searchInfo: { tableId: string; day?: string; time?: number } | null
  ) => void;
}

export const ScheduleTable = memo(
  ({ schedules, tableId, setSearchInfo }: Props) => {
    const { deleteSchedule } = useSchedulesActions();

    const handleScheduleTimeClick = useAutoCallback(
      (day: string, time: number) => {
        setSearchInfo({ tableId, day, time });
      }
    );

    const handleDeleteButtonClick = useAutoCallback(
      (day: string, time: number) => {
        deleteSchedule({ tableId, day, time });
      }
    );

    return (
      <OriginalScheduleTable
        schedules={schedules}
        tableId={tableId}
        onScheduleTimeClick={handleScheduleTimeClick}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
    );
  }
);

ScheduleTable.displayName = "ScheduleTable";
