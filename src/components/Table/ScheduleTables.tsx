import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useScheduleContext } from "../../provider/ScheduleContext.tsx";
import { TableProvider, useTableContext } from "../../provider/TableContext.tsx";
import ScheduleTable from "./ScheduleTable.tsx";
import SearchDialog from "../SearchDialog/SearchDialog.tsx";
import ScheduleDndProvider from "../../provider/ScheduleDndProvider.tsx";
import type { Schedule } from "../../types/types.ts";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";

// 개별 테이블 컴포넌트 - 완전한 격리 (모달 + 버튼 + 상태)
const ScheduleTableWrapper = ({
  tableId,
  index,
  onDuplicate,
  onRemove,
  disabledRemoveButton,
}: {
  tableId: string;
  index: number;
  onDuplicate: (tableId: string, schedules: Schedule[]) => void;
  onRemove: (tableId: string) => void;
  disabledRemoveButton: boolean;
}) => {
  const { schedules, updateSchedules, removeSchedule } = useTableContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const handleSchedulesChange = useAutoCallback((newSchedules: Schedule[]) => {
    updateSchedules(newSchedules);
  });

  const handleDeleteButtonClick = useAutoCallback(({ day, time }: { day: string; time: number }) => {
    removeSchedule(day, time);
  });

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
          <Button colorScheme="green" mx="1px" onClick={() => onDuplicate(tableId, schedules)}>
            복제
          </Button>
          <Button colorScheme="green" isDisabled={disabledRemoveButton} onClick={() => onRemove(tableId)}>
            삭제
          </Button>
        </ButtonGroup>
      </Flex>
      <ScheduleDndProvider tableId={tableId} schedules={schedules} onSchedulesChange={handleSchedulesChange}>
        <ScheduleTable
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={(timeInfo) => setSearchInfo({ tableId, ...timeInfo })}
          onDeleteButtonClick={handleDeleteButtonClick}
        />
      </ScheduleDndProvider>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
    </Stack>
  );
};

export const ScheduleTables = () => {
  const { tableIds, addTable, removeTable, getInitialSchedules } = useScheduleContext();

  const disabledRemoveButton = tableIds.length === 1;

  const duplicate = useAutoCallback((targetId: string, schedules: Schedule[]) => {
    addTable(schedules);
  });

  const remove = useAutoCallback((targetId: string) => {
    removeTable(targetId);
  });

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <TableProvider key={tableId} tableId={tableId} initialSchedules={getInitialSchedules(tableId)}>
            <ScheduleTableWrapper
              tableId={tableId}
              index={index}
              onDuplicate={duplicate}
              onRemove={remove}
              disabledRemoveButton={disabledRemoveButton}
            />
          </TableProvider>
        ))}
      </Flex>
    </>
  );
};
