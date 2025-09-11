import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "../../ScheduleContext.tsx";
import SearchDialog from "../SearchDialog/SearchDialog.tsx";
import { useState, memo, useCallback } from "react";
import ScheduleDndProvider from "../../ScheduleDndProvider.tsx";
import { useTableKeys } from "../../hooks/useTableKeys.ts";
import { TableProvider } from "../../contexts/TableContext.tsx";
import { Schedule } from "../../types.ts";

const ScheduleTableWrapper = memo(
  ({
    tableId,
    index,
    schedules,
    setSearchInfo,
    duplicate,
    remove,
    disabledRemoveButton,
  }: {
    tableId: string;
    index: number;
    schedules: Schedule[];
    setSearchInfo: (info: {
      tableId: string;
      day?: string;
      time?: number;
    }) => void;
    duplicate: (id: string) => void;
    remove: (id: string) => void;
    disabledRemoveButton: boolean;
  }) => {
    // ScheduleTable에서 직접 스케줄을 구독하므로 여기서는 구독하지 않음
    // 각 버튼의 핸들러를 메모이제이션
    const handleAddSchedule = useCallback(() => {
      setSearchInfo({ tableId });
    }, [tableId, setSearchInfo]);

    const handleDuplicate = useCallback(() => {
      duplicate(tableId);
    }, [tableId, duplicate]);

    const handleRemove = useCallback(() => {
      remove(tableId);
    }, [tableId, remove]);

    const handleScheduleTimeClick = useCallback(
      (timeInfo: { day: string; time: number }) => {
        setSearchInfo({ tableId, ...timeInfo });
      },
      [tableId, setSearchInfo]
    );

    const handleDeleteButtonClick = useCallback(
      ({ day, time }: { day: string; time: number }) => {
        // 개별 테이블 Context에서 스케줄 삭제는 ScheduleTable에서 처리
        console.log(`Delete schedule: ${day} ${time}`);
      },
      []
    );

    return (
      <Stack key={tableId} width="600px">
        <Flex justifyContent="space-between" alignItems="center">
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
              onClick={handleRemove}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <TableProvider tableId={tableId} initialSchedules={schedules}>
          <ScheduleDndProvider>
            <ScheduleTable
              key={`schedule-table-${index}`}
              tableId={tableId}
              onScheduleTimeClick={handleScheduleTimeClick}
              onDeleteButtonClick={handleDeleteButtonClick}
            />
          </ScheduleDndProvider>
        </TableProvider>
      </Stack>
    );
  },
  (prevProps, nextProps) => {
    // 커스텀 비교 함수로 해당 테이블의 스케줄만 변경되었을 때만 리렌더링
    return (
      prevProps.tableId === nextProps.tableId &&
      prevProps.index === nextProps.index &&
      prevProps.disabledRemoveButton === nextProps.disabledRemoveButton &&
      prevProps.setSearchInfo === nextProps.setSearchInfo &&
      prevProps.duplicate === nextProps.duplicate &&
      prevProps.remove === nextProps.remove
    );
  }
);
ScheduleTableWrapper.displayName = "ScheduleTableWrapper";

export const ScheduleTables = memo(() => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  // 테이블 키들만 구독 - 테이블 추가/삭제 시에만 리렌더링
  const tableKeys = useTableKeys();
  const disabledRemoveButton = tableKeys.length === 1;

  // 함수들을 메모이제이션하여 불필요한 리렌더링 방지
  const duplicate = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    },
    [setSchedulesMap]
  );

  const remove = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => {
        delete prev[targetId];
        return { ...prev };
      });
    },
    [setSchedulesMap]
  );

  const setSearchInfoCallback = useCallback(
    (info: { tableId: string; day?: string; time?: number }) => {
      setSearchInfo(info);
    },
    []
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableKeys.map((tableId, index) => (
          <ScheduleTableWrapper
            key={tableId}
            tableId={tableId}
            index={index}
            schedules={schedulesMap[tableId] || []}
            setSearchInfo={setSearchInfoCallback}
            duplicate={duplicate}
            remove={remove}
            disabledRemoveButton={disabledRemoveButton}
          />
        ))}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
});
ScheduleTables.displayName = "ScheduleTables";
