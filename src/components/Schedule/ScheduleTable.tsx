import { Box, Popover, PopoverTrigger } from "@chakra-ui/react";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentProps, useMemo } from "react";
import { CellSize, DAY_LABELS } from "../../constants.ts";
import PopoverContentBody from "./PopoverContentBody.tsx";
import ScheduleItem from "./ScheduleItem.tsx";
import ScheduleTableGrid from "./ScheduleTableGrid.tsx";
import { Schedule } from "../../types.ts";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = ({ tableId, schedules, onScheduleTimeClick }: Props) => {
  const getColor = (lectureId: string): string => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    return colors[lectures.indexOf(lectureId) % colors.length];
  };

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
    <Box
      position="relative"
      outline={activeTableId === tableId ? "5px dashed" : undefined}
      outlineColor="blue.300"
    >
      <ScheduleTableGrid onScheduleTimeClick={onScheduleTimeClick} />
      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedule.lecture.id)}
        />
      ))}
    </Box>
  );
};

const DraggableSchedule = ({
  id,
  data,
  bg,
}: { id: string; data: Schedule } & ComponentProps<typeof Box>) => {
  const { day, range, room, lecture } = data;
  const { attributes, setNodeRef, listeners, transform } = useDraggable({
    id,
  });
  const leftIndex = useMemo(
    () => DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]),
    [day]
  );
  const topIndex = useMemo(() => range[0] - 1, [range]);
  const size = useMemo(() => range.length, [range]);

  return (
    <Popover isLazy>
      <PopoverTrigger>
        <Box
          position="absolute"
          left={`${120 + CellSize.WIDTH * leftIndex + 1}px`}
          top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
          width={CellSize.WIDTH - 1 + "px"}
          height={CellSize.HEIGHT * size - 1 + "px"}
          bg={bg}
          p={1}
          boxSizing="border-box"
          cursor="pointer"
          ref={setNodeRef}
          transform={CSS.Translate.toString(transform)}
          {...listeners}
          {...attributes}
        >
          <ScheduleItem lecture={lecture} room={room} />
        </Box>
      </PopoverTrigger>
      <PopoverContentBody tableId={id} day={day} time={range[0]} />
    </Popover>
  );
};

export default ScheduleTable;
