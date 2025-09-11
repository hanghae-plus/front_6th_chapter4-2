import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { CellSize, DAY_LABELS, 분 } from "./constants.ts";
import { Schedule } from "./types.ts";
import { fill2, parseHnM } from "./utils.ts";
import { Fragment, useCallback, useMemo } from "react";
import DndContextWrapper from "./components/DndContextWrapper";
import DraggableScheduleWrapper from "./components/DraggableScheduleWrapper";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (day: string, time: number) => void;
  onDeleteButtonClick?: (day: string, time: number) => void;
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
  const colorMap = useMemo(() => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"] as const;
    const map = new Map<string, string>();
    lectures.forEach((id, index) => {
      map.set(id, colors[index % colors.length]);
    });
    return map;
  }, [schedules]);

  const handleScheduleTimeClick = useCallback(
    (day: string, time: number) => {
      onScheduleTimeClick?.(day, time);
    },
    [onScheduleTimeClick]
  );

  const cellHandlers = useMemo(() => {
    const handlers: Record<string, () => void> = {};

    TIMES.forEach((_, timeIndex) => {
      DAY_LABELS.forEach((day) => {
        const key = `${day}-${timeIndex + 1}`;
        handlers[key] = () => handleScheduleTimeClick(day, timeIndex + 1);
      });
    });

    return handlers;
  }, [handleScheduleTimeClick]);

  const handleDeleteButtonClick = useCallback(
    (day: string, time: number) => {
      onDeleteButtonClick?.(day, time);
    },
    [onDeleteButtonClick]
  );

  const scheduleDeleteHandlers = useMemo(() => {
    return schedules.map(
      (schedule) => () =>
        handleDeleteButtonClick(schedule.day, schedule.range[0])
    );
  }, [schedules, handleDeleteButtonClick]);

  return (
    <DndContextWrapper tableId={tableId}>
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
                onClick={cellHandlers[`${day}-${timeIndex + 1}`]}
              />
            ))}
          </Fragment>
        ))}
      </Grid>

      {schedules.map((schedule, index) => (
        <DraggableScheduleWrapper
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          schedule={schedule}
          color={colorMap.get(schedule.lecture.id) || "#fdd"}
          onDelete={scheduleDeleteHandlers[index]}
        />
      ))}
    </DndContextWrapper>
  );
};
export default ScheduleTable;
