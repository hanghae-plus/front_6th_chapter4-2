import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useSchedulesDispatch, useSchedulesState } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { memo, useCallback, useState } from "react";
import { Schedule } from "./types.ts";

export const ScheduleTables = () => {
  const schedulesMap = useSchedulesState();
  const setSchedulesMap = useSchedulesDispatch();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const duplicate = (targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]]
    }))
  };

  const remove = (targetId: string) => {
    setSchedulesMap(prev => {
      const entries = Object.entries(prev).filter(([key]) => key !== targetId);
      return Object.fromEntries(entries);
    })
  };

  const openSearch = useCallback((tableId: string, timeInfo?: { day: string; time: number }) => {
    setSearchInfo(timeInfo ? { tableId, ...timeInfo } : { tableId });
  }, []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
              <ButtonGroup size="sm" isAttached>
                <Button colorScheme="green" onClick={() => openSearch(tableId)}>시간표 추가</Button>
                <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>복제</Button>
                <Button colorScheme="green" isDisabled={disabledRemoveButton}
                        onClick={() => remove(tableId)}>삭제</Button>
              </ButtonGroup>
            </Flex>
            <ScheduleTableContainer
              key={tableId}
              tableId={tableId}
              schedules={schedules}
              openSearch={openSearch}
            />
          </Stack>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)}/>
    </>
  );
}

interface ScheduleTableContainerProps {
  tableId: string;
  schedules: Schedule[];
  openSearch: (tableId: string, timeInfo?: { day: string; time: number }) => void;
}

const ScheduleTableContainer = memo(({ tableId, schedules, openSearch }: ScheduleTableContainerProps) => {
  const setSchedulesMap = useSchedulesDispatch();

  const handleScheduleTimeClick = useCallback((timeInfo: { day: string; time: number }) => {
    openSearch(tableId, timeInfo);
  }, [openSearch, tableId]);

  const handleDeleteButtonClick = useCallback(({ day, time }: { day: string; time: number }) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: prev[tableId].filter(schedule => schedule.day !== day || !schedule.range.includes(time))
    }));
  }, [setSchedulesMap, tableId]);

  return (
    <ScheduleTable
      tableId={tableId}
      schedules={schedules}
      onScheduleTimeClick={handleScheduleTimeClick}
      onDeleteButtonClick={handleDeleteButtonClick}
    />
  );
});

ScheduleTableContainer.displayName = "ScheduleTableContainer";
