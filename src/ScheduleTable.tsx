import {
  Box,
} from "@chakra-ui/react";
import { Schedule } from "./types/type.ts";

import { useDndContext } from "@dnd-kit/core";
import Schedules from "./Schedules.tsx";
import ScreenTable from "./ScreenTable.tsx";
import { memo } from "react";


interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = memo(({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {

  const dndContext = useDndContext();

  const getActiveTableId = () => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  };

  const activeTableId = getActiveTableId();

  return (
    <Box position="relative" outline={activeTableId === tableId ? "5px dashed" : undefined} outlineColor="blue.300">
        <ScreenTable onScheduleTimeClick={onScheduleTimeClick} />
        <Schedules tableId={tableId} schedules={schedules} onDeleteButtonClick={onDeleteButtonClick} />
    </Box>
  );
}, (prev, next) => prev.schedules === next.schedules);

export default ScheduleTable;
