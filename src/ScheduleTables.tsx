import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useSchedulesData, useSchedulesActions } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState, useCallback, useMemo } from "react";
import { ScheduleDndProvider } from "./ScheduleDndProvider.tsx";

export const ScheduleTables = () => {
  const { schedulesMap } = useSchedulesData();
  const { setSchedulesMap } = useSchedulesActions();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const duplicate = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    },
    [setSchedulesMap]
  );

  const remove = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev: Record<string, any[]>) => {
        delete prev[targetId];
        return { ...prev };
      });
    },
    [setSchedulesMap]
  );

  const handleSetSearchInfo = useCallback((tableId: string) => {
    setSearchInfo({ tableId });
  }, []);

  const handleScheduleTimeClick = useCallback(
    (tableId: string, day: string, time: number) => {
      setSearchInfo({ tableId, day, time });
    },
    []
  );

  const handleScheduleDelete = useCallback(
    (tableId: string, day: string, time: number) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (schedule: any) =>
            schedule.day !== day || !schedule.range.includes(time)
        ),
      }));
    },
    [setSchedulesMap]
  );

  const handleCloseSearchDialog = useCallback(() => {
    setSearchInfo(null);
  }, []);

  const tableHandlers = useMemo(() => {
    const handlers: Record<
      string,
      {
        onAddSchedule: () => void;
        onDuplicate: () => void;
        onRemove: () => void;
        onScheduleTimeClick: (day: string, time: number) => void;
        onDeleteSchedule: (day: string, time: number) => void;
      }
    > = {};

    Object.keys(schedulesMap).forEach((tableId) => {
      handlers[tableId] = {
        onAddSchedule: () => handleSetSearchInfo(tableId),
        onDuplicate: () => duplicate(tableId),
        onRemove: () => remove(tableId),
        onScheduleTimeClick: (day: string, time: number) =>
          handleScheduleTimeClick(tableId, day, time),
        onDeleteSchedule: (day: string, time: number) =>
          handleScheduleDelete(tableId, day, time),
      };
    });

    return handlers;
  }, [
    schedulesMap,
    handleSetSearchInfo,
    duplicate,
    remove,
    handleScheduleTimeClick,
    handleScheduleDelete,
  ]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">
                시간표 {index + 1}
              </Heading>
              <ButtonGroup size="sm" isAttached>
                <Button
                  colorScheme="green"
                  onClick={tableHandlers[tableId]?.onAddSchedule}
                >
                  시간표 추가
                </Button>
                <Button
                  colorScheme="green"
                  mx="1px"
                  onClick={tableHandlers[tableId]?.onDuplicate}
                >
                  복제
                </Button>
                <Button
                  colorScheme="green"
                  isDisabled={disabledRemoveButton}
                  onClick={tableHandlers[tableId]?.onRemove}
                >
                  삭제
                </Button>
              </ButtonGroup>
            </Flex>
            <ScheduleDndProvider draggedTableId={tableId}>
              <ScheduleTable
                key={`schedule-table-${index}`}
                schedules={schedules}
                tableId={tableId}
                onScheduleTimeClick={
                  tableHandlers[tableId]?.onScheduleTimeClick
                }
                onDeleteButtonClick={tableHandlers[tableId]?.onDeleteSchedule}
              />
            </ScheduleDndProvider>
          </Stack>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleCloseSearchDialog} />
    </>
  );
};
