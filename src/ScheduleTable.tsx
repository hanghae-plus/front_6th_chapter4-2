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
import { CellSize, DAY_LABELS, 분 } from "./constants.ts";
import { Schedule, TimeInfo } from "./types.ts";
import { parseHnM } from "./utils.ts";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentProps, Fragment, memo, useCallback, useMemo } from "react";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: TimeInfo) => void;
  onDeleteButtonClick?: (timeInfo: TimeInfo) => void;
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

const DailyLabelItem = memo(({ day }: { day: string }) => {
  return (
    <GridItem key={day} borderLeft="1px" borderColor="gray.300" bg="gray.100">
      <Flex justifyContent="center" alignItems="center" h="full">
        <Text fontWeight="bold">{day}</Text>
      </Flex>
    </GridItem>
  );
});

const TimeLabelItem = memo(({ time }: { time: string }) => {
  return (
    <GridItem key={time} borderTop="1px" borderColor="gray.300" bg="gray.100">
      <Flex justifyContent="center" alignItems="center" h="full">
        <Text fontWeight="bold">{time}</Text>
      </Flex>
    </GridItem>
  );
});

const DailyLabelItemInner = memo(
  ({
    day,
    timeIndex,
    onScheduleTimeClick,
  }: {
    day: string;
    timeIndex: number;
    onScheduleTimeClick: (timeInfo: TimeInfo) => void;
  }) => {
    const handleClick = useCallback(() => {
      onScheduleTimeClick?.({ day, time: timeIndex + 1 });
    }, [day, timeIndex, onScheduleTimeClick]);
    return (
      <GridItem
        key={`${day}-${timeIndex + 2}`}
        borderWidth="1px 0 0 1px"
        borderColor="gray.300"
        bg={timeIndex > 17 ? "gray.100" : "white"}
        cursor="pointer"
        _hover={{ bg: "yellow.100" }}
        onClick={handleClick}
      />
    );
  }
);
const Table = memo(
  ({
    onScheduleTimeClick,
  }: {
    onScheduleTimeClick: (timeInfo: TimeInfo) => void;
  }) => {
    return (
      <Grid
        templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
        templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
        bg="white"
        fontSize="sm"
        textAlign="center"
        outline="1px solid"
        outlineColor="gray.300">
        <GridItem key="교시" borderColor="gray.300" bg="gray.100">
          <Flex justifyContent="center" alignItems="center" h="full" w="full">
            <Text fontWeight="bold">교시</Text>
          </Flex>
        </GridItem>
        {DAY_LABELS.map((day) => (
          <DailyLabelItem key={day} day={day} />
        ))}
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
            <TimeLabelItem time={time} />
            {DAY_LABELS.map((day) => (
              <DailyLabelItemInner
                key={`${day}-${timeIndex + 2}`}
                day={day}
                timeIndex={timeIndex}
                onScheduleTimeClick={onScheduleTimeClick ?? (() => {})}
              />
            ))}
          </Fragment>
        ))}
      </Grid>
    );
  }
);
const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];

const ScheduleText = memo(
  ({ lecture, room }: { lecture: { title: string }; room?: string }) => (
    <>
      <Text fontSize="sm" fontWeight="bold">
        {lecture.title}
      </Text>
      <Text fontSize="xs">{room || ""}</Text>
    </>
  )
);

ScheduleText.displayName = "ScheduleText";

const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    const lectures = useMemo(
      () => [...new Set(schedules.map(({ lecture }) => lecture.id))],
      [schedules]
    );

    const getColor = useCallback(
      (lectureId: string): string => {
        return colors[lectures.indexOf(lectureId) % colors.length];
      },
      [lectures]
    );

    const dndContext = useDndContext();

    const activeTableId = useMemo(() => {
      const activeId = dndContext.active?.id;
      if (activeId) {
        return String(activeId).split(":")[0];
      }
      return null;
    }, [dndContext.active?.id]);

    const deleteHandler = useCallback(
      (day: string, time: number) => () => {
        onDeleteButtonClick?.({ day, time });
      },
      [onDeleteButtonClick]
    );

    const handleScheduleTimeClick = useCallback(
      (timeInfo: TimeInfo) => {
        onScheduleTimeClick?.(timeInfo);
      },
      [onScheduleTimeClick]
    );

    return (
      <Box
        position="relative"
        outline={activeTableId === tableId ? "5px dashed" : undefined}
        outlineColor="blue.300">
        <Table onScheduleTimeClick={handleScheduleTimeClick} />
        {schedules.map((schedule, index) => {
          // 더 안정적인 key 생성
          const scheduleKey = `${schedule.lecture.id}-${
            schedule.day
          }-${schedule.range.join("-")}`;
          return (
            <DraggableSchedule
              key={scheduleKey}
              id={`${tableId}:${index}`}
              data={schedule}
              bg={getColor(schedule.lecture.id)}
              onDeleteButtonClick={deleteHandler(
                schedule.day,
                schedule.range[0]
              )}
            />
          );
        })}
      </Box>
    );
  }
);

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
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });

    // 포지션 계산 메모이제이션 - schedule이 변경될 때만 재계산
    const position = useMemo(() => {
      const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
      const topIndex = range[0] - 1;
      const size = range.length;

      return {
        top: 40 + (topIndex * CellSize.HEIGHT + 1) + "px",
        left: 120 + CellSize.WIDTH * leftIndex + 1 + "px",
        width: CellSize.WIDTH - 1 + "px",
        height: CellSize.HEIGHT * size - 1 + "px",
      };
    }, [day, range]); // day와 range가 변경될 때만 재계산

    // lecture과 room 메모이제이션 - 값이 변경되지 않으면 리렌더링 방지
    const scheduleInfo = useMemo(
      () => ({ lecture, room }),
      [lecture, room] // lecture 객체와 room이 변경될 때만 재생성
    );

    // Box 스타일 메모이제이션 - bg가 변경될 때만 재생성
    const boxStyle = useMemo(
      () => ({
        position: "absolute" as const,
        left: position.left,
        top: position.top,
        width: position.width,
        height: position.height,
        bg,
        p: 1,
        boxSizing: "border-box" as const,
        cursor: "pointer",
      }),
      [position.left, position.top, position.width, position.height, bg]
    );

    return (
      <Popover>
        <PopoverTrigger>
          <Box
            {...boxStyle}
            ref={setNodeRef}
            transform={CSS.Translate.toString(transform)}
            {...listeners}
            {...attributes}>
            <ScheduleText
              lecture={scheduleInfo.lecture}
              room={scheduleInfo.room}
            />
          </Box>
        </PopoverTrigger>
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
  }
);

export default ScheduleTable;
