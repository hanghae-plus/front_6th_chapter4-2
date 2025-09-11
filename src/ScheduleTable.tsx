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
import { CellSize, DAY_LABELS, 분 } from "./constants.ts";
import { Schedule } from "./types.ts";
import { fill2, parseHnM } from "./utils.ts";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentProps, Fragment, memo, useMemo } from "react";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";

type TimeInfo = { day: string; time: number };

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: TimeInfo) => void;
  onDeleteButtonClick?: (timeInfo: TimeInfo) => void;
  isActive?: boolean;
}

const TIMES = [
  ...Array(18)
    .fill(0)
    .map((v, k) => v + k * 30 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 30 * 분)}`),

  ...Array(6)
    .fill(18 * 30 * 분)
    .map((v, k) => v + k * 55 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 50 * 분)}`),
] as const;

const ScheduleTable = ({
  tableId,
  schedules,
  onScheduleTimeClick,
  onDeleteButtonClick,
  isActive = false,
}: Props) => {
  const getColor = useMemo(() => {
    const uniqueIds = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    const lectureColor = new Map<string, string>();
    uniqueIds.forEach((id, idx) => {
      lectureColor.set(id, colors[idx % colors.length]);
    });
    return (lectureId: string): string => lectureColor.get(lectureId) ?? colors[0];
  }, [schedules]);

  const handleScheduleTimeClock = useAutoCallback((timeInfo: TimeInfo) =>
    onScheduleTimeClick?.(timeInfo),
  );

  const handleDeleteSchedule = useAutoCallback((schedule: Schedule) =>
    onDeleteButtonClick?.({ day: schedule.day, time: schedule.range[0] }),
  );

  return (
    <Box position="relative" outline={isActive ? "5px dashed" : undefined} outlineColor="blue.300">
      <TableGrid onScheduleTimeClick={handleScheduleTimeClock} />

      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedule.lecture.id)}
          onDeleteButtonClick={(schedule) => handleDeleteSchedule(schedule)}
        />
      ))}
    </Box>
  );
};

const TableGrid = memo(
  ({ onScheduleTimeClick }: { onScheduleTimeClick?: (timeInfo: TimeInfo) => void }) => {
    const gray100 = "#EDF2F7";
    const gray200 = "#E2E8F0";
    const gray300 = "#CBD5E0";
    const yellow100 = "#FEFCBF";

    const gridStyle: React.CSSProperties = {
      display: "grid",
      gridTemplateColumns: `120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`,
      gridTemplateRows: `40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`,
      backgroundColor: "#ffffff",
      fontSize: "14px",
      textAlign: "center",
      outline: `1px solid ${gray300}`,
    };

    const headerCellStyle: React.CSSProperties = {
      borderLeft: `1px solid ${gray300}`,
      backgroundColor: gray100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const timeColCellBase: React.CSSProperties = {
      borderTop: `1px solid ${gray300}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const dayCellBase: React.CSSProperties = {
      borderTop: `1px solid ${gray300}`,
      borderLeft: `1px solid ${gray300}`,
      cursor: "pointer",
    };

    return (
      <div style={gridStyle}>
        <div style={{ backgroundColor: gray100 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <strong>교시</strong>
          </div>
        </div>
        {DAY_LABELS.map((day) => (
          <div key={day} style={headerCellStyle}>
            <strong>{day}</strong>
          </div>
        ))}
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
            <div
              style={{ ...timeColCellBase, backgroundColor: timeIndex > 17 ? gray200 : gray100 }}
            >
              <span style={{ fontSize: "12px" }}>
                {fill2(timeIndex + 1)} ({time})
              </span>
            </div>
            {DAY_LABELS.map((day) => (
              <div
                key={`${day}-${timeIndex + 2}`}
                style={{
                  ...dayCellBase,
                  backgroundColor: timeIndex > 17 ? gray100 : "#ffffff",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = yellow100)}
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = timeIndex > 17 ? gray100 : "#ffffff")
                }
                onClick={() => onScheduleTimeClick?.({ day, time: timeIndex + 1 })}
              />
            ))}
          </Fragment>
        ))}
      </div>
    );
  },
);

const DraggableSchedule = memo(
  ({
    id,
    data,
    bg,
    onDeleteButtonClick,
  }: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
      onDeleteButtonClick: (schedule: Schedule) => void;
    }) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    return (
      <Popover>
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
            <Text fontSize="sm" fontWeight="bold">
              {lecture.title}
            </Text>
            <Text fontSize="xs">{room}</Text>
          </Box>
        </PopoverTrigger>
        <PopoverContent onClick={(event) => event.stopPropagation()}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Text>강의를 삭제하시겠습니까?</Text>
            <Button colorScheme="red" size="xs" onClick={() => onDeleteButtonClick(data)}>
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  },
);

export default ScheduleTable;
