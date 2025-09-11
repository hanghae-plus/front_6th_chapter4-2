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
import { CellSize, DAY_LABELS, 분 } from "../../constants.ts";
import { Schedule } from "../../types.ts";
import { fill2, parseHnM } from "../../utils.ts";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentProps, Fragment, memo, useMemo } from "react";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import { useTableSchedules } from "../../hooks/useTableSchedules.ts";

type TimeInfo = {
  day: string;
  time: number;
};

interface Props {
  tableId: string;
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

const ScheduleTableGrid = memo(
  ({
    onScheduleTimeClick,
  }: {
    onScheduleTimeClick?: (timeInfo: TimeInfo) => void;
  }) => {
    return (
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
          <GridItem
            key={day}
            borderLeft="1px"
            borderColor="gray.300"
            bg="gray.100"
          >
            <Flex justifyContent="center" alignItems="center" h="full">
              <Text fontWeight="bold">{day}</Text>
            </Flex>
          </GridItem>
        ))}
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
            <GridItem
              borderTop="1px solid"
              borderColor="gray.300"
              bg={timeIndex > 17 ? "gray.200" : "gray.100"}
            >
              <Flex justifyContent="center" alignItems="center" h="full">
                <Text fontSize="xs">
                  {fill2(timeIndex + 1)} ({time})
                </Text>
              </Flex>
            </GridItem>
            {DAY_LABELS.map((day) => (
              <GridItem
                key={`${day}-${timeIndex + 2}`}
                borderWidth="1px 0 0 1px"
                borderColor="gray.300"
                bg={timeIndex > 17 ? "gray.100" : "white"}
                cursor="pointer"
                _hover={{ bg: "yellow.100" }}
                onClick={() =>
                  onScheduleTimeClick?.({ day, time: timeIndex + 1 })
                }
              />
            ))}
          </Fragment>
        ))}
      </Grid>
    );
  }
);
ScheduleTableGrid.displayName = "ScheduleTableGrid";

// 개별 스케줄 아이템을 메모이제이션하여 드래그 시 다른 블록들이 리렌더링되지 않도록 함
const MemoizedScheduleItem = memo(
  ({
    schedule,
    index,
    tableId,
    bg,
    onDeleteButtonClick,
  }: {
    schedule: Schedule;
    index: number;
    tableId: string;
    bg: string;
    onDeleteButtonClick?: (timeInfo: TimeInfo) => void;
  }) => {
    return (
      <DraggableSchedule
        id={`${tableId}:${index}`}
        data={schedule}
        bg={bg}
        onDeleteButtonClick={() =>
          onDeleteButtonClick?.({
            day: schedule.day,
            time: schedule.range[0],
          })
        }
      />
    );
  },
  (prevProps, nextProps) => {
    // 개별 스케줄 아이템만 변경되었을 때만 리렌더링
    // 드래그 중인 아이템만 리렌더링되도록 최적화
    const isScheduleEqual = prevProps.schedule === nextProps.schedule;
    const isIndexEqual = prevProps.index === nextProps.index;
    const isTableIdEqual = prevProps.tableId === nextProps.tableId;
    const isBgEqual = prevProps.bg === nextProps.bg;
    const isCallbackEqual =
      prevProps.onDeleteButtonClick === nextProps.onDeleteButtonClick;

    // 모든 props가 동일하면 리렌더링하지 않음
    return (
      isScheduleEqual &&
      isIndexEqual &&
      isTableIdEqual &&
      isBgEqual &&
      isCallbackEqual
    );
  }
);
MemoizedScheduleItem.displayName = "MemoizedScheduleItem";

// PopoverContent를 별도로 메모이제이션하여 불필요한 리렌더링 방지
const MemoizedPopoverContent = memo(
  ({ onDeleteButtonClick }: { onDeleteButtonClick: () => void }) => {
    return (
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
    );
  },
  (prevProps, nextProps) => {
    // onDeleteButtonClick이 동일하면 리렌더링하지 않음
    return prevProps.onDeleteButtonClick === nextProps.onDeleteButtonClick;
  }
);
MemoizedPopoverContent.displayName = "MemoizedPopoverContent";

const ScheduleTable = memo(
  ({ tableId, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    // 해당 테이블의 스케줄만 구독 - 다른 테이블 변경 시 리렌더링되지 않음
    const { schedules } = useTableSchedules(tableId);

    const getColor = useMemo(() => {
      const uniqueIds = [
        ...new Set(schedules.map(({ lecture }) => lecture.id)),
      ];
      const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
      const lectureColor = new Map<string, string>();
      uniqueIds.forEach((id, idx) => {
        lectureColor.set(id, colors[idx % colors.length]);
      });
      return (lectureId: string): string =>
        lectureColor.get(lectureId) ?? colors[0];
    }, [schedules]);

    const dndContext = useDndContext();

    const getActiveTableId = () => {
      const activeId = dndContext.active?.id;
      if (activeId) {
        return String(activeId).split(":")[0];
      }
      return null;
    };

    const activeTableId = getActiveTableId();

    const handleScheduleTimeClick = useAutoCallback((timeInfo: TimeInfo) => {
      onScheduleTimeClick?.(timeInfo);
    });

    return (
      <Box
        position="relative"
        outline={activeTableId === tableId ? "5px dashed" : undefined}
        outlineColor="blue.300"
      >
        <ScheduleTableGrid onScheduleTimeClick={handleScheduleTimeClick} />

        {schedules.map((schedule, index) => {
          // 각 스케줄 아이템을 완전히 독립적으로 렌더링
          const scheduleId = `${schedule.lecture.title}-${index}`;
          const scheduleBg = getColor(schedule.lecture.id);

          return (
            <MemoizedScheduleItem
              key={scheduleId}
              schedule={schedule}
              index={index}
              tableId={tableId}
              bg={scheduleBg}
              onDeleteButtonClick={onDeleteButtonClick}
            />
          );
        })}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    // 커스텀 비교 함수로 더 정확한 메모이제이션
    // schedules는 내부에서 구독하므로 props 비교에서 제외
    const isTableIdEqual = prevProps.tableId === nextProps.tableId;
    const isScheduleTimeClickEqual =
      prevProps.onScheduleTimeClick === nextProps.onScheduleTimeClick;
    const isDeleteButtonClickEqual =
      prevProps.onDeleteButtonClick === nextProps.onDeleteButtonClick;

    // 모든 props가 동일하면 리렌더링하지 않음
    return (
      isTableIdEqual && isScheduleTimeClickEqual && isDeleteButtonClickEqual
    );
  }
);
ScheduleTable.displayName = "ScheduleTable";

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
      useDraggable({
        id,
      });
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    // 드래그 중일 때는 Popover 없이 렌더링
    if (isDragging) {
      return (
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
      );
    }

    // 드래그가 끝나면 Popover와 함께 렌더링
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
        <MemoizedPopoverContent onDeleteButtonClick={onDeleteButtonClick} />
      </Popover>
    );
  },
  (prevProps, nextProps) => {
    // 드래그 중인 블록만 리렌더링되도록 최적화
    // 데이터가 동일하고 드래그 상태가 변경되지 않았으면 리렌더링하지 않음
    const isDataEqual = prevProps.data === nextProps.data;
    const isBgEqual = prevProps.bg === nextProps.bg;
    const isCallbackEqual =
      prevProps.onDeleteButtonClick === nextProps.onDeleteButtonClick;
    const isIdEqual = prevProps.id === nextProps.id;

    // 모든 props가 동일하면 리렌더링하지 않음
    return isIdEqual && isDataEqual && isBgEqual && isCallbackEqual;
  }
);
DraggableSchedule.displayName = "DraggableSchedule";

export default ScheduleTable;
