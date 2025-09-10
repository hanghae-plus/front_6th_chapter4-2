import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import SearchDialog from "./SearchDialog";
import { useCallback, useState } from "react";
import { useScheduleStore } from "../store/scheduleStore";
import { useShallow } from "zustand/shallow";
import ScheduleDndProvider from "../context/ScheduleDndProvider.tsx";

export const ScheduleTables = () => {
  const tableIds = useScheduleStore(useShallow((state) => Object.keys(state.schedulesMap)));

  const duplicate = useScheduleStore((state) => state.duplicateTable);
  const remove = useScheduleStore((state) => state.removeTable);
  const deleteScheduleItem = useScheduleStore((state) => state.deleteScheduleItem);

  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const handleDeleteButtonClick = useCallback(
    (tableId: string, info: { day: string; time: number }) => {
      deleteScheduleItem(tableId, info.day, info.time);
    },
    [deleteScheduleItem]
  );

  const handleScheduleTimeClick = useCallback((timeInfo: any) => {
    setSearchInfo(timeInfo);
  }, []);

  if (!tableIds) return null;

  const disabledRemoveButton = tableIds.length === 1;

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
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
                tableId={tableId}
                key={`schedule-table-${index}`}
                onScheduleTimeClick={handleScheduleTimeClick}
                onDeleteButtonClick={handleDeleteButtonClick}
              />
            </ScheduleDndProvider>
          </Stack>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
    </>
  );
};
