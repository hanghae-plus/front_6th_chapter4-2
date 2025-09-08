import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { Fragment, memo, useCallback, useMemo } from "react";
import DndContextWrapper from "./components/DndContextWrapper";
import DraggableScheduleWrapper from "./components/DraggableScheduleWrapper";
import { CellSize, DAY_LABELS, 분 } from "./constants";
import { Schedule } from "./types";
import { fill2, parseHnM } from "./utils";

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
  onScheduleTimeClick: onScheduleTimeClickProp,
  onDeleteButtonClick: onDeleteButtonClickProp,
}: Props) => {
  const onScheduleTimeClick = useCallback(
    (day: string, timeIndex: number) => {
      onScheduleTimeClickProp?.({ day, time: timeIndex + 1 });
    },
    [onScheduleTimeClickProp],
  );

  const onDeleteButtonClick = useCallback(
    (day: string, time: number) => {
      onDeleteButtonClickProp?.({ day, time });
    },
    [onDeleteButtonClickProp],
  );
  const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
  const lectureIds = useMemo(() => [...new Set(schedules.map(({ lecture }) => lecture.id))], [schedules]);

  const getColor = (lectureId: string): string => {
    return colors[lectureIds.indexOf(lectureId) % colors.length];
  };

  const renderedSchedules = useMemo(
    () =>
      schedules.map((schedule, index) => (
        <DraggableScheduleWrapper
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          schedule={schedule}
          color={getColor(schedule.lecture.id)}
          onDelete={() => onDeleteButtonClick(schedule.day, schedule.range[0])}
        />
      )),
    [schedules, tableId, getColor, onDeleteButtonClick],
  );

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
          <GridItem key={day} borderLeft="1px" borderColor="gray.300" bg="gray.100">
            <Flex justifyContent="center" alignItems="center" h="full">
              <Text fontWeight="bold">{day}</Text>
            </Flex>
          </GridItem>
        ))}
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
            <GridItem borderTop="1px solid" borderColor="gray.300" bg={timeIndex > 17 ? "gray.200" : "gray.100"}>
              <Flex justifyContent="center" alignItems="center" h="full">
                <Text fontSize="xs">
                  {fill2(timeIndex + 1)} ({time})
                </Text>
              </Flex>
            </GridItem>
            {DAY_LABELS.map((day) => (
              <TimeSlot
                key={`${day}-${timeIndex + 2}`}
                day={day}
                timeIndex={timeIndex}
                onClick={() => onScheduleTimeClick(day, timeIndex)}
              />
            ))}
          </Fragment>
        ))}
      </Grid>

      {renderedSchedules}
    </DndContextWrapper>
  );
};

interface TimeSlotProps {
  day: string;
  timeIndex: number;
  onClick: () => void;
}

const TimeSlot = memo(({ day, timeIndex, onClick }: TimeSlotProps) => {
  return (
    <GridItem
      key={`${day}-${timeIndex + 2}`}
      borderWidth="1px 0 0 1px"
      borderColor="gray.300"
      bg={timeIndex > 17 ? "gray.100" : "white"}
      cursor="pointer"
      _hover={{ bg: "yellow.100" }}
      onClick={onClick}
    />
  );
});

TimeSlot.displayName = "TimeSlot";

export default ScheduleTable;
