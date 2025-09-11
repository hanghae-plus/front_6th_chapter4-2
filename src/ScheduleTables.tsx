import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { useState, useCallback, memo, useMemo, startTransition } from "react";
import { useScheduleContext, useScheduleTable } from "./ScheduleContext";
import ScheduleTable from "./ScheduleTable";
import ScheduleDndProvider from "./ScheduleDndProvider";
import SearchDialog from "./SearchDialog";

const ScheduleTableWithDnd = memo(({ 
  tableId, 
  onScheduleTimeClick, 
  onDeleteButtonClick 
}: { 
  tableId: string;
  onScheduleTimeClick: (tableId: string, timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick: (tableId: string, day: string, time: number) => void;
}) => {
  const { schedules } = useScheduleTable(tableId);

  const handleTimeClick = useCallback((timeInfo: { day: string; time: number }) => {
    onScheduleTimeClick(tableId, timeInfo);
  }, [tableId, onScheduleTimeClick]);

  const handleDeleteClick = useCallback((timeInfo: { day: string; time: number }) => {
    onDeleteButtonClick(tableId, timeInfo.day, timeInfo.time);
  }, [tableId, onDeleteButtonClick]);

  return (
    <ScheduleDndProvider tableId={tableId}>
      <ScheduleTable
        schedules={schedules}
        tableId={tableId}
        onScheduleTimeClick={handleTimeClick}
        onDeleteButtonClick={handleDeleteClick}
      />
    </ScheduleDndProvider>
  );
});

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = useMemo(() => 
    Object.keys(schedulesMap).length === 1, 
    [schedulesMap]
  );

  const duplicate = useCallback((targetId: string) => {
    startTransition(() => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    });
  }, [setSchedulesMap]);

  const remove = useCallback((targetId: string) => {
    startTransition(() => {
      setSchedulesMap((prev) => {
        delete prev[targetId];
        return { ...prev };
      });
    });
  }, [setSchedulesMap]);

  const handleScheduleTimeClick = useCallback((tableId: string, timeInfo: { day: string; time: number }) => {
    startTransition(() => {
      setSearchInfo({ tableId, ...timeInfo });
    });
  }, []);

  const handleDeleteButtonClick = useCallback((tableId: string, day: string, time: number) => {
    startTransition(() => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (schedule) =>
            schedule.day !== day || !schedule.range.includes(time),
        ),
      }));
    });
  }, [setSchedulesMap]);

  const tableIds = useMemo(() => Object.keys(schedulesMap), [schedulesMap]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <IndividualScheduleTable
            key={tableId}
            tableId={tableId}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            onAddSchedule={() => setSearchInfo({ tableId })}
            onDuplicate={duplicate}
            onRemove={remove}
            onScheduleTimeClick={handleScheduleTimeClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
};

const IndividualScheduleTable = memo(({
  tableId,
  index,
  disabledRemoveButton,
  onAddSchedule,
  onDuplicate,
  onRemove,
  onScheduleTimeClick,
  onDeleteButtonClick,
}: {
  tableId: string;
  index: number;
  disabledRemoveButton: boolean;
  onAddSchedule: () => void;
  onDuplicate: (tableId: string) => void;
  onRemove: (tableId: string) => void;
  onScheduleTimeClick: (tableId: string, timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick: (tableId: string, day: string, time: number) => void;
}) => {
  const handleDuplicate = useCallback(() => onDuplicate(tableId), [onDuplicate, tableId]);
  const handleRemove = useCallback(() => onRemove(tableId), [onRemove, tableId]);

  return (
    <Stack width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={onAddSchedule}>
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
      <ScheduleTableWithDnd 
        tableId={tableId} 
        onScheduleTimeClick={onScheduleTimeClick}
        onDeleteButtonClick={onDeleteButtonClick}
      />
    </Stack>
  );
});
