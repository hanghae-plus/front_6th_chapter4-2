import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { memo, useCallback, useState } from "react";
import { Schedule } from "./types.ts";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";

const ScheduleTableWrapper = memo(
  ({
    tableId,
    schedules,
    index,
    setSearchInfo,
  }: {
    tableId: string;
    schedules: Schedule[];
    index: number;
    setSearchInfo: (
      info: { tableId: string; day?: string; time?: number } | null
    ) => void;
  }) => {
    const { schedulesMap, setSchedulesMap } = useScheduleContext();
    const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

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

    const handleScheduleTimeClick = useCallback(
      (timeInfo: { day: string; time: number }) =>
        setSearchInfo({ tableId, ...timeInfo }),
      [setSearchInfo, tableId]
    );

    const handleDeleteButtonClick = useCallback(
      ({ day, time }: { day: string; time: number }) =>
        setSchedulesMap((prev) => ({
          ...prev,
          [tableId]: prev[tableId].filter(
            (schedule) => schedule.day !== day || !schedule.range.includes(time)
          ),
        })),
      [setSchedulesMap, tableId]
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
            onScheduleTimeClick={handleScheduleTimeClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  }
);

export const ScheduleTables = () => {
  const { schedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const handleCloseDialog = useCallback(() => {
    setSearchInfo(null);
  }, []);

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
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleCloseDialog} />
    </>
  );
};
