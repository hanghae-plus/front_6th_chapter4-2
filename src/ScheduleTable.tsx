import {
  Box,
} from "@chakra-ui/react";
import { Schedule } from "./types/type.ts";

import { useDndContext } from "@dnd-kit/core";
import Schedules from "./Schedules.tsx";
import ScreenTable from "./ScreenTable.tsx";
import { memo } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import { useSchedule } from "./hooks/useSchedule.ts";


interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = memo(({ tableId, schedules: init, onScheduleTimeClick, onDeleteButtonClick }: Props) => {

  const dndContext = useDndContext();
  const {schedules, handleDragEnd, handleDragStart, isDrag} = useSchedule(init)

  const getActiveTableId = () => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  };

  const activeTableId = getActiveTableId();

  return (
    <ScheduleDndProvider handleDragStart={handleDragStart} handleDragEnd={handleDragEnd}>
      <Box position="relative" outline={isDrag ? "5px dashed" : undefined} outlineColor="blue.300">
          <ScreenTable onScheduleTimeClick={onScheduleTimeClick} />
          <Schedules tableId={tableId} schedules={schedules} onDeleteButtonClick={onDeleteButtonClick} />
      </Box>
    </ScheduleDndProvider>
  );
}, (prev, next) => prev.schedules === next.schedules);

export default ScheduleTable;
