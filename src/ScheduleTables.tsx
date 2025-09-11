import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState, useCallback, memo } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import { Schedule } from "./types.ts";

export const ScheduleTableWrapper = memo(
  ({
    tableId,
    schedules,
    index,
    setSearchInfo,
    duplicate,
    disabledRemoveButton,
    remove,
    handleScheduleTimeClick,
    handleDeleteButtonClick,
  }: {
    tableId: string;
    schedules: Schedule[];
    index: number;
    setSearchInfo: (info: { tableId: string }) => void;
    duplicate: (targetId: string) => void;
    disabledRemoveButton: boolean;
    remove: (targetId: string) => void;
    handleScheduleTimeClick: (
      tableId: string,
      timeInfo: { day: string; time: number }
    ) => void;
    handleDeleteButtonClick: (
      tableId: string,
      timeInfo: { day: string; time: number }
    ) => void;
  }) => {
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
              handleScheduleTimeClick(tableId, timeInfo)
            }
            onDeleteButtonClick={(timeInfo) =>
              handleDeleteButtonClick(tableId, timeInfo)
            }
          />
        </ScheduleDndProvider>
      </Stack>
    );
  }
);
export const ScheduleTables = memo(() => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  // useCallback을 사용하여 함수들을 메모이제이션
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
      setSchedulesMap((prev) => {
        const newMap = { ...prev };
        delete newMap[targetId];
        return newMap;
      });
    },
    [setSchedulesMap]
  );

  const handleScheduleTimeClick = useCallback(
    (tableId: string, timeInfo: { day: string; time: number }) => {
      setSearchInfo({ tableId, ...timeInfo });
    },
    []
  );

  const handleDeleteButtonClick = useCallback(
    (tableId: string, timeInfo: { day: string; time: number }) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (schedule) =>
            schedule.day !== timeInfo.day ||
            !schedule.range.includes(timeInfo.time)
        ),
      }));
    },
    [setSchedulesMap]
  );

  const handleSearchDialogClose = useCallback(() => {
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
            duplicate={duplicate}
            disabledRemoveButton={disabledRemoveButton}
            remove={remove}
            handleScheduleTimeClick={handleScheduleTimeClick}
            handleDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleSearchDialogClose} />
    </>
  );
});

ScheduleTables.displayName = "ScheduleTables";
