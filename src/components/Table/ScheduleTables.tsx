import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { useState, useCallback, useEffect } from "react";
import { useScheduleContext } from "../../provider/ScheduleContext.tsx";
import ScheduleTable from "./ScheduleTable.tsx";
import SearchDialog from "../SearchDialog/SearchDialog.tsx";
import ScheduleDndProvider from "../../provider/ScheduleDndProvider.tsx";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import type { Schedule } from "../../types/types.ts";

// 개별 테이블 컴포넌트 - 완전히 독립적인 상태 관리
const ScheduleTableWrapper = ({
  tableId,
  index,
  onSearchInfoChange,
  onDeleteButtonClick,
  onRegisterRef,
}: {
  tableId: string;
  index: number;
  onSearchInfoChange: (info: { tableId: string; day?: string; time?: number }) => void;
  onDeleteButtonClick: () => void;
  onRegisterRef: (tableId: string, ref: { addSchedules: (schedules: Schedule[]) => void }) => void;
}) => {
  const { getInitialSchedules } = useScheduleContext();
  const [schedules, setSchedules] = useState<Schedule[]>(() => getInitialSchedules(tableId));

  const handleSchedulesChange = useCallback((newSchedules: Schedule[]) => {
    setSchedules(newSchedules);
  }, []);

  const handleDeleteButtonClick = useCallback(
    ({ day, time }: { day: string; time: number }) => {
      setSchedules((prev) => prev.filter((schedule) => schedule.day !== day || !schedule.range.includes(time)));
      onDeleteButtonClick();
    },
    [onDeleteButtonClick]
  );

  const addSchedules = useCallback((newSchedules: Schedule[]) => {
    setSchedules((prev) => [...prev, ...newSchedules]);
  }, []);

  // ref 등록
  useEffect(() => {
    onRegisterRef(tableId, { addSchedules });
  }, [tableId, addSchedules, onRegisterRef]);

  return (
    <Stack width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={() => onSearchInfoChange({ tableId })}>
            시간표 추가
          </Button>
        </ButtonGroup>
      </Flex>
      <ScheduleDndProvider tableId={tableId} schedules={schedules} onSchedulesChange={handleSchedulesChange}>
        <ScheduleTable
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={(timeInfo) => onSearchInfoChange({ tableId, ...timeInfo })}
          onDeleteButtonClick={handleDeleteButtonClick}
        />
      </ScheduleDndProvider>
    </Stack>
  );
};

export const ScheduleTables = () => {
  const { tableIds, duplicateTable, removeTable } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);
  const [tableRefs, setTableRefs] = useState<Record<string, { addSchedules: (schedules: Schedule[]) => void }>>({});

  const disabledRemoveButton = tableIds.length === 1;

  const duplicate = useAutoCallback((targetId: string) => {
    duplicateTable(targetId);
  });

  const remove = useAutoCallback((targetId: string) => {
    removeTable(targetId);
    setTableRefs((prev) => {
      const newRefs = { ...prev };
      delete newRefs[targetId];
      return newRefs;
    });
  });

  const handleDeleteButtonClick = useCallback(() => {
    // 개별 테이블에서 삭제는 각 테이블의 상태에서 처리되므로 여기서는 추가 로직이 필요 없음
  }, []);

  const handleAddSchedule = useCallback(
    (tableId: string, newSchedules: Schedule[]) => {
      if (tableRefs[tableId]) {
        tableRefs[tableId].addSchedules(newSchedules);
      }
    },
    [tableRefs]
  );

  const registerTableRef = useCallback((tableId: string, ref: { addSchedules: (schedules: Schedule[]) => void }) => {
    setTableRefs((prev) => ({
      ...prev,
      [tableId]: ref,
    }));
  }, []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <Stack key={tableId}>
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
            <ScheduleTableWrapper
              tableId={tableId}
              index={index}
              onSearchInfoChange={setSearchInfo}
              onDeleteButtonClick={handleDeleteButtonClick}
              onRegisterRef={registerTableRef}
            />
          </Stack>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} onAddSchedule={handleAddSchedule} />
    </>
  );
};
