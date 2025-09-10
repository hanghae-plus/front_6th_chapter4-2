import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useSchedulesDispatch, useSchedulesState } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { memo, useCallback, useState } from "react";
import type { Schedule } from "./types.ts";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";

export const ScheduleTables = () => {
  const schedulesMap = useSchedulesState();
  const setSchedulesMap = useSchedulesDispatch();
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
      setSchedulesMap((prev) => {
        const entries = Object.entries(prev).filter(
          ([key]) => key !== targetId
        );
        return Object.fromEntries(entries);
      });
    },
    [setSchedulesMap]
  );

  const openSearch = useCallback(
    (tableId: string, timeInfo?: { day: string; time: number }) => {
      setSearchInfo(timeInfo ? { tableId, ...timeInfo } : { tableId });
    },
    []
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <TableCard
            key={tableId}
            index={index}
            tableId={tableId}
            schedules={schedules}
            openSearch={openSearch}
            onDuplicate={duplicate}
            onRemove={remove}
            disabledRemoveButton={disabledRemoveButton}
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

const TableCard = memo(
  ({
    index,
    tableId,
    schedules,
    openSearch,
    onDuplicate,
    onRemove,
    disabledRemoveButton,
  }: {
    index: number;
    tableId: string;
    schedules: Schedule[];
    openSearch: (tableId: string) => void;
    onDuplicate: (tableId: string) => void;
    onRemove: (tableId: string) => void;
    disabledRemoveButton: boolean;
  }) => {
    return (
      <Stack width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={() => openSearch(tableId)}>
              시간표 추가
            </Button>
            <Button
              colorScheme="green"
              mx="1px"
              onClick={() => onDuplicate(tableId)}
            >
              복제
            </Button>
            <Button
              colorScheme="green"
              isDisabled={disabledRemoveButton}
              onClick={() => onRemove(tableId)}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleDndProvider>
          <ScheduleTable
            tableId={tableId}
            schedules={schedules}
            openSearch={openSearch}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  }
);
