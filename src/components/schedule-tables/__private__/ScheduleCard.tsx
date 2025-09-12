import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { memo } from "react";

import { ScheduleTable } from "./ScheduleTable";
import { ScheduleDndProvider } from "../../../contexts";
import { useAutoCallback } from "../../../hooks";
import type { Schedule, TimeInfo } from "../../../types";

type ScheduleCardProps = {
  index: number;
  tableId: string;
  schedules: Schedule[];
  disabledRemoveButton: boolean;
  isActive: boolean;
  onOpenSearch: (tableId: string, day?: string, time?: number) => void;
  onDuplicate: (tableId: string) => string;
  onDelete: (tableId: string) => void;
  onUpdateSchedules: (tableId: string, schedules: Schedule[]) => void;
  onRemoveSchedule: (tableId: string, day: string, time: number) => void;
};

export function ScheduleCard({
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
}: ScheduleCardProps) {
  const handleScheduleTimeClick = useAutoCallback((timeInfo: TimeInfo) => {
    onOpenSearch(tableId, timeInfo.day, timeInfo.time);
  });

  const handleDeleteButtonClick = useAutoCallback(({ day, time }: TimeInfo) => {
    onRemoveSchedule(tableId, day, time);
  });

  const handleSchedulesChange = useAutoCallback((updatedSchedules: Schedule[]) => {
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
          <Button colorScheme="green" isDisabled={disabledRemoveButton} onClick={handleDelete}>
            삭제
          </Button>
        </ButtonGroup>
      </Flex>

      <ScheduleDndProvider tableId={tableId} schedules={schedules} onSchedulesChange={handleSchedulesChange}>
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

export const MemoizedScheduleCard = memo(ScheduleCard);
