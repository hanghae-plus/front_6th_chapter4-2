import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentProps, useState } from "react";
import { Schedule } from "../../types";
import { useAutoCallback } from "../../hooks";
import { DaysNode } from "./DaysNode";
import { ScheduleItem } from "./ScheduleItem";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
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
      sx={{
        "& p.title": { fontSize: "sm", fontWeight: "bold" },
        "& p.room": { fontSize: "xs" },
      }}
    >
      <DaysNode onClick={useAutoCallback(onScheduleTimeClick)} />
      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedule.lecture.id)}
          onDeleteButtonClick={() => onDeleteButtonClick?.({ day: schedule.day, time: schedule.range[0] })}
        />
      ))}
    </Box>
  );
};

const DraggableSchedule = ({
  id,
  data,
  bg,
  onDeleteButtonClick,
}: ComponentProps<typeof ScheduleItem> & { onDeleteButtonClick: () => void }) => {
  const [enabledPopover, setEnabledPopover] = useState(false);
  const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });
  const enablePopover = useAutoCallback(() => setEnabledPopover(true));

  const item = (
    <ScheduleItem
      bg={bg}
      data={data}
      ref={setNodeRef}
      transform={CSS.Translate.toString(transform)}
      onMouseEnter={enablePopover}
      {...listeners}
      {...attributes}
    />
  );

  if (!enabledPopover) {
    return item;
  }

  return (
    <Popover isLazy>
      <PopoverTrigger>{item}</PopoverTrigger>
      <PopoverContent onClick={(event) => event.stopPropagation()}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text>강의를 삭제하시겠습니까?</Text>
          <Button colorScheme="red" size="xs" onClick={onDeleteButtonClick}>
            삭제
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ScheduleTable;
