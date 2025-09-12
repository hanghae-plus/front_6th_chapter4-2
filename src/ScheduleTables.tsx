import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState, memo } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import { useDndContext } from "@dnd-kit/core";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";

export const ScheduleTables = () => {
  const {
    schedulesMap,
    duplicateScheduleTable,
    deleteScheduleTable,
    removeSchedule,
    updateSchedules,
  } = useScheduleContext();
  const dndContext = useDndContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const getActiveTableId = useAutoCallback(() => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  });

  const activeTableId = getActiveTableId();

  const openSearch = useAutoCallback(
    (tableId: string, day?: string, time?: number) => {
      setSearchInfo({ tableId, day, time });
    }
  );

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
            isActive={activeTableId === tableId}
            onOpenSearch={openSearch}
            onDuplicate={duplicateScheduleTable}
            onDelete={deleteScheduleTable}
            onUpdateSchedules={updateSchedules}
            onRemoveSchedule={removeSchedule}
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

interface ScheduleCardProps {
  index: number;
  tableId: string;
  schedules: any;
  disabledRemoveButton: boolean;
  isActive: boolean;
  onOpenSearch: (tableId: string, day?: string, time?: number) => void;
  onDuplicate: (tableId: string) => string;
  onDelete: (tableId: string) => void;
  onUpdateSchedules: (tableId: string, schedules: any) => void;
  onRemoveSchedule: (tableId: string, day: string, time: number) => void;
}

const ScheduleCard = memo(
  ({
    index,
    tableId,
    schedules,
    disabledRemoveButton,
    isActive,
    onOpenSearch,
    onDuplicate,
    onDelete,
    onUpdateSchedules,
    onRemoveSchedule,
  }: ScheduleCardProps) => {
    const handleScheduleTimeClick = useAutoCallback(
      (timeInfo: { day: string; time: number }) => {
        onOpenSearch(tableId, timeInfo.day, timeInfo.time);
      }
    );

    const handleDeleteButtonClick = useAutoCallback(
      ({ day, time }: { day: string; time: number }) => {
        onRemoveSchedule(tableId, day, time);
      }
    );

    const handleSchedulesChange = useAutoCallback((updatedSchedules: any) => {
      onUpdateSchedules(tableId, updatedSchedules);
    });

    const handleAddSchedule = useAutoCallback(() => {
      onOpenSearch(tableId);
    });

    const handleDuplicate = useAutoCallback(() => {
      onDuplicate(tableId);
    });

    const handleDelete = useAutoCallback(() => {
      onDelete(tableId);
    });

    return (
      <Stack width="600px">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          outline={isActive ? "3px dashed" : undefined}
          outlineColor="blue.400"
          p={isActive ? 2 : 0}
          borderRadius="md"
          transition="all 0.2s"
        >
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
              onClick={handleDelete}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleDndProvider
          tableId={tableId}
          schedules={schedules}
          onSchedulesChange={handleSchedulesChange}
        >
          <ScheduleTable
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

ScheduleCard.displayName = "ScheduleCard";
