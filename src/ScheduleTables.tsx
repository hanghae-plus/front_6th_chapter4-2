import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useSchedulesData, useSchedulesActions } from "./ScheduleContext.tsx";
import SearchDialog from "./components/search-dialog/SearchDialog.tsx";
import { memo, useState, useCallback } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import { Schedule } from "./types.ts";

const Table = memo(({ 
  tableId, 
  index, 
  setSchedulesMap, 
  schedules, 
  setSearchInfo, 
  duplicate, 
  disabledRemoveButton, 
  remove 
}: { 
  tableId: string, 
  index: number, 
  setSchedulesMap: (schedulesMap: any) => void, 
  schedules: Schedule[], 
  setSearchInfo: (info: { tableId: string, day?: string, time?: number }) => void, 
  duplicate: (targetId: string) => void, 
  disabledRemoveButton: boolean, 
  remove: (targetId: string) => void 
}) => {
  return (
    <Stack key={tableId} width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>시간표 추가</Button>
          <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>복제</Button>
          <Button colorScheme="green" isDisabled={disabledRemoveButton}
                  onClick={() => remove(tableId)}>삭제</Button>
        </ButtonGroup>
      </Flex>
      <ScheduleDndProvider>
        <ScheduleTable
          key={`schedule-table-${index}`}
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={(timeInfo) => setSearchInfo({ tableId, ...timeInfo })}
          onDeleteButtonClick={({ day, time }) => setSchedulesMap((prev: any) => ({
            ...prev,
            [tableId]: prev[tableId].filter((schedule: any) => schedule.day !== day || !schedule.range.includes(time))
          }))}
        />
      </ScheduleDndProvider>
    </Stack>
  );
}, (prevProps, nextProps) => {
  return prevProps.schedules === nextProps.schedules;
});

export const ScheduleTables = () => {
  const schedulesMap = useSchedulesData();
  const { setSchedulesMap, duplicate, remove } = useSchedulesActions();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  // setSearchInfo를 useCallback으로 메모이제이션
  const handleSetSearchInfo = useCallback((info: { tableId: string, day?: string, time?: number }) => {
    setSearchInfo(info);
  }, []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <Table key={tableId} tableId={tableId} index={index} setSchedulesMap={setSchedulesMap} schedules={schedules} setSearchInfo={handleSetSearchInfo} duplicate={duplicate} disabledRemoveButton={disabledRemoveButton} remove={remove} />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={useCallback(() => setSearchInfo(null), [])}/>
    </>
  );
}
