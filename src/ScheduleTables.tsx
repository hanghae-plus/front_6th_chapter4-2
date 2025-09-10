import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { memo, useCallback } from "react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import { Schedule } from "./types.ts";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
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

  const duplicate = useAutoCallback((targetId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  });

  const remove = useAutoCallback((targetId: string) => {
    setSchedulesMap((prev) => {
      delete prev[targetId];
      return { ...prev };
    });
  });

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleCard
            key={tableId}
            index={index}
            tableId={tableId}
            schedules={schedules}
            disabledRemoveButton={disabledRemoveButton}
            openSearch={openSearch}
            duplicate={duplicate}
            remove={remove}
            setSchedulesMap={setSchedulesMap}
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
  schedules: Schedule[];
  disabledRemoveButton: boolean;
  openSearch: (tableId: string, day?: string, time?: number) => void;
  duplicate: (tableId: string) => void;
  remove: (tableId: string) => void;
  setSchedulesMap: ReturnType<typeof useScheduleContext>["setSchedulesMap"];
  isActive: boolean;
}

const ScheduleCard = memo(
  ({
    index,
    tableId,
    schedules,
    disabledRemoveButton,
    openSearch,
    duplicate,
    remove,
    setSchedulesMap,
    isActive,
  }: ScheduleCardProps) => {
    const onScheduleTimeClick = useCallback(
      (timeInfo: { day: string; time: number }) => openSearch(tableId, timeInfo.day, timeInfo.time),
      [openSearch, tableId],
    );

    const onDeleteButtonClick = useCallback(
      ({ day, time }: { day: string; time: number }) =>
        setSchedulesMap((prev) => ({
          ...prev,
          [tableId]: prev[tableId].filter(
            (schedule) => schedule.day !== day || !schedule.range.includes(time),
          ),
        })),
      [setSchedulesMap, tableId],
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
            key={`schedule-table-${index}`}
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
