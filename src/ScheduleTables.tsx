import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { memo, useCallback } from "react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleActions, useScheduleState } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";

export const ScheduleTables = () => {
  const { schedulesMap } = useScheduleState();
  const dndContext = useDndContext();

  const getActiveTableId = () => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  };

  const activeTableId = getActiveTableId();

  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const openSearch = useAutoCallback((tableId: string, day?: string, time?: number) => {
    setSearchInfo({ tableId, day, time });
  });

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.keys(schedulesMap).map((tableId, index) => (
          <ScheduleCard
            key={tableId}
            index={index}
            tableId={tableId}
            disabledRemoveButton={disabledRemoveButton}
            openSearch={openSearch}
            isActive={activeTableId === tableId}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
    </>
  );
};

interface ScheduleCardProps {
  index: number;
  tableId: string;
  disabledRemoveButton: boolean;
  openSearch: (tableId: string, day?: string, time?: number) => void;
  isActive: boolean;
}

const ScheduleCard = memo(
  ({ index, tableId, disabledRemoveButton, openSearch, isActive }: ScheduleCardProps) => {
    const { schedulesMap } = useScheduleState();
    const { duplicate, remove, updateTable } = useScheduleActions();
    const schedules = schedulesMap[tableId] ?? [];
    const onScheduleTimeClick = useCallback(
      (timeInfo: { day: string; time: number }) => openSearch(tableId, timeInfo.day, timeInfo.time),
      [openSearch, tableId],
    );

    const onDeleteButtonClick = useCallback(
      ({ day, time }: { day: string; time: number }) =>
        updateTable(tableId, (prev) =>
          prev.filter((s) => s.day !== day || !s.range.includes(time)),
        ),
      [updateTable, tableId],
    );

    return (
      <Stack width="600px">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          outline={isActive ? "5px dashed" : undefined}
          outlineColor="blue.300"
        >
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={() => openSearch(tableId)}>
              시간표 추가
            </Button>
            <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>
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
            key={`schedule-table-${tableId}`}
            schedules={schedules}
            tableId={tableId}
            onScheduleTimeClick={onScheduleTimeClick}
            onDeleteButtonClick={onDeleteButtonClick}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  },
);

ScheduleCard.displayName = "ScheduleCard";
