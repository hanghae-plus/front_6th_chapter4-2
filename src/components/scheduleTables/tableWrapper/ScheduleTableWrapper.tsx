import { Schedule } from "../../../types.ts";
import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "../scheduleTable/ScheduleTable.tsx";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import { memo } from "react";
import { useSchedulesStore } from "../../../store/schedulesStore.ts";

export const ScheduleTableWrapper = memo(
  ({
    tableId,
    schedules,
    index,
    setSearchInfo,
    disabledRemoveButton,
  }: {
    tableId: string;
    schedules: Schedule[];
    index: number;
    setSearchInfo: (info: {
      tableId: string;
      day?: string;
      time?: number;
    }) => void;
    disabledRemoveButton: boolean;
  }) => {
    const setSchedulesMap = useSchedulesStore((state) => state.setSchedulesMap);

    const duplicate = (targetId: string) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    };

    const remove = (targetId: string) => {
      setSchedulesMap((prev) => {
        delete prev[targetId];
        return { ...prev };
      });
    };

    return (
      <Stack key={tableId} width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button
              colorScheme="green"
              onClick={() => setSearchInfo({ tableId })}
            >
              시간표 추가
            </Button>
            <Button
              colorScheme="green"
              mx="1px"
              onClick={() => duplicate(tableId)}
            >
              복제
            </Button>
            <Button
              colorScheme="green"
              isDisabled={disabledRemoveButton}
              onClick={() => remove(tableId)}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleDndProvider>
          <ScheduleTable
            key={`schedule-table-${index}`}
            schedules={schedules}
            tableId={tableId}
            onScheduleTimeClick={(timeInfo) =>
              setSearchInfo({ tableId, ...timeInfo })
            }
            onDeleteButtonClick={({ day, time }) =>
              setSchedulesMap((prev) => ({
                ...prev,
                [tableId]: prev[tableId].filter(
                  (schedule) =>
                    schedule.day !== day || !schedule.range.includes(time)
                ),
              }))
            }
          />
        </ScheduleDndProvider>
      </Stack>
    );
  }
);
