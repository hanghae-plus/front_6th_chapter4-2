import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useScheduleCommandContext, useScheduleQueryContext } from "./ScheduleProvider";
import { SearchInfo } from "../../types";
import { useAutoCallback } from "../../hooks";
import { ScheduleTableWrapper } from "./SchedueTableWrapper";
import { SearchDialog } from "../search-dialog";

export const ScheduleTables = () => {
  const setSchedulesMap = useScheduleCommandContext();
  const schedulesMap = useScheduleQueryContext();
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const add = useAutoCallback((tableId: string) => setSearchInfo({ tableId }));

  const duplicate = useAutoCallback((targetId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  });

  const remove = useAutoCallback((targetId: string) => {
    setSchedulesMap((prev) => {
      delete prev[targetId];
      return { ...prev };
    });
  });

  const deleteSchedule = useAutoCallback(({ tableId, day, time }: Required<SearchInfo>) =>
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: prev[tableId].filter((schedule) => schedule.day !== day || !schedule.range.includes(time)),
    })),
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleTableWrapper
            key={tableId}
            index={index}
            schedules={schedules}
            tableId={tableId}
            disabledRemoveButton={disabledRemoveButton}
            onScheduleTimeClick={setSearchInfo}
            onDeleteButtonClick={deleteSchedule}
            onAddButtonClick={add}
            onDeleteTableButtonClick={remove}
            onDuplicateButtonClick={duplicate}
          />
        ))}
      </Flex>
      {!!searchInfo && (
        <SearchDialog
          searchInfo={searchInfo}
          onAddSchedule={() => setSearchInfo(null)}
          onOverlayClick={() => setSearchInfo(null)}
        />
      )}
    </>
  );
};
