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
import { Schedule } from "./types.ts";
import { fill2, parseHnM } from "./utils.ts";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentProps, Fragment, memo, useCallback } from "react";
import { useScheduleSetter } from "./ScheduleContext.tsx";
import { LectureDeletePopover } from "./LectureDeletePopover.tsx";
import { LectureItemPopover } from "./LectureItemPopover.tsx";

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

interface ScheduleTableProps {
  tableId: string;
  schedules: Schedule[];
  active: boolean;
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
}
/**
 * ScheduleTable
 * props가 변경되지 않았을 때 불필요한 리렌더링 방지를 위해 memo로 감싸줌
 */
const ScheduleTable = memo(
  ({ tableId, schedules, active, onScheduleTimeClick }: ScheduleTableProps) => {
    console.log("ScheduleTable rerender!");
    // 🔃 불필요한 연산 최적화
    // useCallback으로 묶고, schedules가 변할때만 재연산되도록 함
    const getColor = useCallback(
      (lectureId: string): string => {
        const lectures = [
          ...new Set(schedules.map(({ lecture }) => lecture.id)),
        ];
        const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
        return colors[lectures.indexOf(lectureId) % colors.length];
      },
      [schedules]
    );

    return (
      <Box
        position="relative"
        outline={active ? "5px dashed" : undefined}
        outlineColor="blue.300"
      >
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

        {schedules.map((schedule, index) => (
          <DraggableSchedule
            tableId={tableId}
            key={`${schedule.lecture.title}-${index}`}
            id={`${tableId}:${index}`}
            data={schedule}
            bg={getColor(schedule.lecture.id)}
            // onDeleteButtonClick={() =>
            //   onDeleteButtonClick?.({
            //     day: schedule.day,
            //     time: schedule.range[0],
            //   })
            // }
          />
        ))}
      </Box>
    );
  }
);

const DraggableSchedule = memo(
  ({
    tableId,
    id,
    data,
    bg,
  }: { tableId: string; id: string; data: Schedule } & ComponentProps<
    typeof Box
  >) => {
    return (
      <Popover>
        <LectureItemPopover data={data} bg={bg} id={id} />
        <LectureDeletePopover tableId={tableId} data={data} />
      </Popover>
    );
  }
);

export default ScheduleTable;
