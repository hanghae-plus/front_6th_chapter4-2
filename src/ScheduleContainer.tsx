import { Stack } from "@chakra-ui/react";
import ScheduleDndProvider from "./ScheduleDndProvider";
import ScheduleHeader from "./ScheduleHeader";
import { useAutoCallback } from "./hooks/useAutoCallback";
import { useScheduleActions } from "./ScheduleContext";
import { Schedule } from "./types";
import { Dispatch, memo, SetStateAction } from "react";
import ScheduleTable from "./ScheduleTable";

interface ScheduleContainerProps {
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

const ScheduleContainer = ({
  index,
  tableId,
  schedules,
  disabledRemoveButton,
  setSearchInfo,
}: ScheduleContainerProps) => {
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
    <ScheduleDndProvider key={tableId} draggableId={tableId}>
      <Stack key={tableId} width="600px">
        <ScheduleHeader
          index={index}
          disabledRemoveButton={disabledRemoveButton}
          duplicate={duplicate}
          remove={remove}
          handleSearchClick={handleSearchClick}
        />
        <ScheduleTable
          key={`schedule-table-${index}`}
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={handleScheduleTimeClick}
          // onDeleteButtonClick={handleDeleteButtonClick(tableId)}
        />
      </Stack>
    </ScheduleDndProvider>
  );
};

export default memo(ScheduleContainer);
