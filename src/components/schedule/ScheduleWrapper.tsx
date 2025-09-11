import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { memo, useCallback } from "react";
import ScheduleTable from "../../ScheduleTable";
import { ScheduleDndProvider } from "../../ScheduleDndProvider";
import { useSchedulesActions } from "../../contexts";
import { Schedule } from "../../types";

interface Props {
  tableId: string;
  schedules: Schedule[];
  index: number;
  setSearchInfo: (
    info: { tableId: string; day?: string; time?: number } | null
  ) => void;
  disabledRemoveButton: boolean;
}

export const ScheduleWrapper = memo(
  ({
    tableId,
    schedules,
    index,
    setSearchInfo,
    disabledRemoveButton,
  }: Props) => {
    const { setSchedulesMap, deleteSchedule } = useSchedulesActions();

    const handleScheduleTimeClick = useCallback(
      (day: string, time: number) => {
        setSearchInfo({ tableId, day, time });
      },
      [tableId, setSearchInfo]
    );

    const handleAddSchedule = useCallback(() => {
      setSearchInfo({ tableId });
    }, [tableId, setSearchInfo]);

    const handleDuplicate = useCallback(() => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[tableId]],
      }));
    }, [tableId, setSchedulesMap]);

    const handleRemove = useCallback(() => {
      setSchedulesMap((prev: Record<string, any[]>) => {
        delete prev[tableId];
        return { ...prev };
      });
    }, [tableId, setSchedulesMap]);

    const handleDeleteSchedule = useCallback(
      (day: string, time: number) => {
        deleteSchedule({ tableId, day, time });
      },
      [tableId, deleteSchedule]
    );

    return (
      <Stack width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={handleAddSchedule}>
              시간표 추가
            </Button>
            <Button colorScheme="green" mx="1px" onClick={handleDuplicate}>
              복제
            </Button>
            <Button
              colorScheme="green"
              isDisabled={disabledRemoveButton}
              onClick={handleRemove}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleDndProvider draggedTableId={tableId}>
          <ScheduleTable
            key={`schedule-table-${tableId}`}
            schedules={schedules}
            tableId={tableId}
            onScheduleTimeClick={handleScheduleTimeClick}
            onDeleteButtonClick={handleDeleteSchedule}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  }
);

ScheduleWrapper.displayName = "ScheduleWrapper";
