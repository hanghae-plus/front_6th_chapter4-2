import { Flex } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { useState } from "react";

import { useScheduleContext } from "../../contexts";
import { useAutoCallback } from "../../hooks";
import type { SearchInfo } from "../../types";
import { SearchDialog } from "../search-dialog";
import { MemoizedScheduleCard } from "./__private__";

export const ScheduleTables = () => {
  const { schedulesMap, duplicateScheduleTable, deleteScheduleTable, removeSchedule, updateSchedules } =
    useScheduleContext();
  const dndContext = useDndContext();

  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  const getActiveTableId = useAutoCallback(() => {
    const activeId = dndContext.active?.id;
    return activeId ? String(activeId).split(":")[0] : null;
  });

  const openSearch = useAutoCallback((tableId: string, day?: string, time?: number) => {
    setSearchInfo({ tableId, day, time });
  });

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;
  const activeTableId = getActiveTableId();

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <MemoizedScheduleCard
            key={tableId}
            index={index}
            tableId={tableId}
            schedules={schedules}
            disabledRemoveButton={disabledRemoveButton}
            isActive={activeTableId === tableId}
            onOpenSearch={openSearch}
            onDuplicate={duplicateScheduleTable}
            onDelete={deleteScheduleTable}
            onUpdateSchedules={updateSchedules}
            onRemoveSchedule={removeSchedule}
          />
        ))}
      </Flex>

      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
    </>
  );
};
