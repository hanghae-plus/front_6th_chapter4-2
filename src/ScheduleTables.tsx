import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import {
  useScheduleActionContext,
  useScheduleStateContext,
} from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { memo, useCallback, useState } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import { Schedule } from "./types.ts";

const ScheduleTableWrapper = memo(
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
    setSearchInfo: (
      info: { tableId: string; day?: string; time?: number } | null
    ) => void;
    disabledRemoveButton: boolean;
  }) => {
    const { addTable, removeTable, updateTableSchedules } =
      useScheduleActionContext();

    const duplicate = () => {
      const newTableId = `schedule-${Date.now()}`;
      addTable(newTableId, [...schedules]);
    };

    const remove = (targetId: string) => {
      removeTable(targetId);
    };

    const handleScheduleTimeClick = useCallback(
      (timeInfo: { day: string; time: number }) =>
        setSearchInfo({ tableId, ...timeInfo }),
      [setSearchInfo, tableId]
    );

    const handleDeleteButtonClick = useCallback(
      ({ day, time }: { day: string; time: number }) =>
        updateTableSchedules(tableId, (prev) =>
          prev.filter(
            (schedule) => schedule.day !== day || !schedule.range.includes(time)
          )
        ),
      [updateTableSchedules, tableId]
    );

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
            <Button colorScheme="green" mx="1px" onClick={duplicate}>
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
            onScheduleTimeClick={handleScheduleTimeClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  }
);

export const ScheduleTables = () => {
  const { schedulesMap, tableCount } = useScheduleStateContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const handleCloseDialog = useCallback(() => {
    setSearchInfo(null);
  }, []);

  const disabledRemoveButton = tableCount === 1;

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleTableWrapper
            key={tableId}
            tableId={tableId}
            schedules={schedules}
            index={index}
            setSearchInfo={setSearchInfo}
            disabledRemoveButton={disabledRemoveButton}
          />
        ))}
      </Flex>
      {searchInfo && (
        <SearchDialog searchInfo={searchInfo} onClose={handleCloseDialog} />
      )}
    </>
  );
};
