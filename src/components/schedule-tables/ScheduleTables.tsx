import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";

import { ScheduleDndProvider, useScheduleContext } from "../../contexts";
import { SearchDialog } from "../search-dialog";
import { ScheduleTable } from "./__private__";
import type { SearchInfo } from "../../types";

export function ScheduleTables() {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();

  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

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
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <Stack key={tableId} width="600px">
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
                    [tableId]: prev[tableId].filter(
                      (schedule) => schedule.day !== day || !schedule.range.includes(time),
                    ),
                  }))
                }
              />
            </ScheduleDndProvider>
          </Stack>
        ))}
      </Flex>

      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
    </>
  );
}
