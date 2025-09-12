import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { type SetStateAction, type Dispatch, memo } from "react";

import { ScheduleTable } from "./ScheduleTable";
import { ScheduleDndProvider, useScheduleContext } from "../../../contexts";
import type { Schedule, SearchInfo } from "../../../types";

type ScheduleTableWrapperProps = {
  tableId: string;
  schedules: Schedule[];
  index: number;
  setSearchInfo: Dispatch<SetStateAction<SearchInfo | null>>;
};

export function ScheduleTableWrapper({ tableId, schedules, index, setSearchInfo }: ScheduleTableWrapperProps) {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();

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

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  return (
    <Stack width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>
            시간표 추가
          </Button>
          <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>
            복제
          </Button>
          <Button colorScheme="green" isDisabled={disabledRemoveButton} onClick={() => remove(tableId)}>
            삭제
          </Button>
        </ButtonGroup>
      </Flex>

      <ScheduleDndProvider>
        <ScheduleTable
          key={`schedule-table-${index}`}
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={(timeInfo) => setSearchInfo({ tableId, ...timeInfo })}
          onDeleteButtonClick={({ day, time }) =>
            setSchedulesMap((prev) => ({
              ...prev,
              [tableId]: prev[tableId].filter((schedule) => schedule.day !== day || !schedule.range.includes(time)),
            }))
          }
        />
      </ScheduleDndProvider>
    </Stack>
  );
}

export const MemoizedScheduleTableWrapper = memo(ScheduleTableWrapper);
