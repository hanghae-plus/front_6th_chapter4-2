import { Fragment, memo } from "react";
import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { CellSize, DAY_LABELS, 분 } from "../constants.ts";
import { fill2, parseHnM } from "../utils.ts";

// 시간표의 시간 슬롯 정의 (1~18교시: 30분, 19~24교시: 50분)
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

interface ScheduleTemplateProps {
  tableId: string;
  onCellClick: React.Dispatch<
    React.SetStateAction<{
      tableId: string;
      day?: string;
      time?: number;
    } | null>
  >;
}

const ScheduleTemplate = memo(
  ({ tableId, onCellClick }: ScheduleTemplateProps) => {
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
                  onCellClick({ tableId, day, time: timeIndex + 1 })
                }
              />
            ))}
          </Fragment>
        ))}
      </Grid>
    );
  }
);

export default ScheduleTemplate;
