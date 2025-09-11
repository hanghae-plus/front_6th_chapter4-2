import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { CellSize, DAY_LABELS, 분 } from "./constants/index.ts";
import { Schedule } from "./types.ts";
import { parseHnM } from "./utils/index.ts";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentProps, Fragment, memo, useCallback } from "react";
import DayHeaderCell from "./components/cells/DayHeaderCell.tsx";
import TableCell from "./components/cells/TableCell.tsx";
import TimeCell from "./components/cells/TimeCell.tsx";
import TableOutline from "./components/cells/TableOutline.tsx";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
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
}: Props) => {
  const getColor = useCallback(
    (lectureId: string): string => {
      const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
      const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
      return colors[lectures.indexOf(lectureId) % colors.length];
    },
    [schedules]
  );

  const memoizedOnScheduleTimeClick = useCallback(
    (timeInfo: { day: string; time: number }) => {
      onScheduleTimeClick?.(timeInfo);
    },
    [onScheduleTimeClick]
  );

  const memoizedOnDeleteButtonClick = useCallback(
    (timeInfo: { day: string; time: number }) => {
      onDeleteButtonClick?.(timeInfo);
    },
    [onDeleteButtonClick]
  );
  return (
    <Box position="relative">
      <Grid
        templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
        templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
        bg="white"
        fontSize="sm"
        textAlign="center"
        outline="1px solid"
        outlineColor="gray.300"
      >
        <GridItem key="교시" borderColor="gray.300" bg="gray.100">
          <Flex justifyContent="center" alignItems="center" h="full" w="full">
            <Text fontWeight="bold">교시</Text>
          </Flex>
        </GridItem>
        {DAY_LABELS.map((day) => (
          <DayHeaderCell key={day} day={day} />
        ))}
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
            <TimeCell time={time} timeIndex={timeIndex} />
            {DAY_LABELS.map((day) => (
              <TableCell
                key={`${day}-${timeIndex + 2}`}
                day={day}
                timeIndex={timeIndex}
                onScheduleTimeClick={memoizedOnScheduleTimeClick}
              />
            ))}
          </Fragment>
        ))}
      </Grid>

      <TableOutline tableId={tableId} />

      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedule.lecture.id)}
          onDeleteButtonClick={() =>
            memoizedOnDeleteButtonClick?.({
              day: schedule.day,
              time: schedule.range[0],
            })
          }
        />
      ))}
    </Box>
  );
};

const DraggableSchedule = memo(
  ({
    id,
    data,
    bg,
    onDeleteButtonClick,
  }: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
      onDeleteButtonClick: () => void;
    }) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform, isDragging } =
      useDraggable({ id });
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    const shouldRenderPopover = !isDragging;

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

        {shouldRenderPopover && (
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
        )}
      </Popover>
    );
  }
);

export default ScheduleTable;
