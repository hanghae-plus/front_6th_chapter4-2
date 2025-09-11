import { Stack } from "@chakra-ui/react";

import { Dispatch, memo, SetStateAction } from "react";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import { useScheduleActions } from "../../Provider/ScheduleProvider.tsx";
import ScheduleDndProvider from "../../Provider/ScheduleDndProvider.tsx";
import ScheduleTable from "./ScheduleTable.tsx";
import { Schedule } from "../../types.ts";
import ScheduleTableHeader from "./ScheduleTableHeader.tsx";

interface ScheduleItemProps {
  index: number;
  tableId: string;
  schedules: Schedule[];
  disabledRemoveButton: boolean;
  setSearchInfo: Dispatch<
    SetStateAction<{
      tableId: string;
      day?: string;
      time?: number;
    } | null>
  >;
}

const ScheduleContainer = memo(
  ({
    index,
    tableId,
    schedules,
    disabledRemoveButton,
    setSearchInfo,
  }: ScheduleItemProps) => {
    const { setSchedulesMap } = useScheduleActions();

    const duplicate = useAutoCallback(() => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[tableId]],
      }));
    });

    const remove = useAutoCallback(() => {
      setSchedulesMap((prev) => {
        delete prev[tableId];
        return { ...prev };
      });
    });

    const handleSearchClick = useAutoCallback(() => {
      setSearchInfo({ tableId });
    });

    const handleScheduleTimeClick = useAutoCallback((timeInfo) => {
      setSearchInfo({ tableId, ...timeInfo });
    });

    return (
      <Stack key={tableId} width="600px">
        <ScheduleTableHeader
          index={index}
          duplicate={duplicate}
          remove={remove}
          handleSearchClick={handleSearchClick}
          disabledRemoveButton={disabledRemoveButton}
        />
        <ScheduleDndProvider draggedTableId={tableId}>
          <ScheduleTable
            key={`schedule-table-${index}`}
            schedules={schedules}
            tableId={tableId}
            onScheduleTimeClick={handleScheduleTimeClick}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  }
);

ScheduleContainer.displayName = "ScheduleContainer";

export default ScheduleContainer;
