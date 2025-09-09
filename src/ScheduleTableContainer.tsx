import { Stack } from "@chakra-ui/react";
import { memo } from "react";
import { ScheduleTableHeader } from "./ScheduleTableHeader";
import ScheduleTable from "./ScheduleTable";

import { useSchedule } from "./store/useSchedules";
import useCustomDnd from "./hooks/useCustomDnd";

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

    return (
      <Stack>
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
          onScheduleTimeClick={({ day, time }) =>
            setSearchInfo({ tableId, day, time })
          }
        />
      </Stack>
    );
  }
);
