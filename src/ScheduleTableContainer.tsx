import { Stack } from "@chakra-ui/react";
import { memo, useCallback } from "react";
import { ScheduleTableHeader } from "./ScheduleTableHeader";
import ScheduleTable from "./ScheduleTable";

import { useSchedule } from "./store/useSchedules";
import ScheduleDndProvider from "./ScheduleDndProvider";

interface ScheduleTableContainerProps {
  index: number;
  tableId: string;
  setSearchInfo: React.Dispatch<
    React.SetStateAction<{
      tableId: string;
      day?: string;
      time?: number;
    } | null>
  >;
  disabledRemoveButton: boolean;
  isActive: boolean;
}

export const ScheduleTableContainer = memo(
  ({
    index,
    tableId,
    setSearchInfo,
    disabledRemoveButton,
    isActive,
  }: ScheduleTableContainerProps) => {
    const schedules = useSchedule(tableId);

    const handleScheduleTimeClick = useCallback(
      ({ day, time }: { day: string; time: number }) => {
        setSearchInfo({ tableId, day, time });
      },
      [setSearchInfo, tableId]
    );

    return (
      <Stack>
        <ScheduleDndProvider>
          <ScheduleTableHeader
            index={index}
            setSearchInfo={setSearchInfo}
            disabledRemoveButton={disabledRemoveButton}
            tableId={tableId}
          />
          <ScheduleTable
            tableId={tableId}
            schedules={schedules}
            active={isActive}
            onScheduleTimeClick={handleScheduleTimeClick}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  }
);
