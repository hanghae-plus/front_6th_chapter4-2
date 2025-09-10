import { Flex } from '@chakra-ui/react/flex';
import { Stack } from '@chakra-ui/react/stack';
import { Heading } from '@chakra-ui/react/typography';
import { Button, ButtonGroup } from '@chakra-ui/react/button';
import { useScheduleContext } from '../../../ScheduleContext.tsx';
import React, { useState, useCallback, useMemo, lazy, memo } from 'react';

import ScheduleDndProvider from '../../../ScheduleDndProvider.tsx';
import { DragStateProvider } from '../../../SchedulesDragStateProvider.tsx';
import { Schedule } from '../../../types.ts';
const ScheduleTable = lazy(() => import('./ScheduleTable.tsx'));

interface LazyComponentWithPreload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends React.LazyExoticComponent<React.ComponentType<any>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preload: () => Promise<any>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyWithPreloading(importFn: () => Promise<any>) {
  const Component = React.lazy(importFn) as LazyComponentWithPreload;
  Component.preload = importFn;
  return Component;
}
const SearchDialog = lazyWithPreloading(
  () => import('../SearchDialog/SearchDialog.tsx')
);

const TableButtonGroup = memo(
  ({
    tableId,
    disabled,
    onSearch,
    onDuplicate,
    onRemove,
  }: {
    tableId: string;
    disabled: boolean;
    onSearch: (tableId: string) => void;
    onDuplicate: (tableId: string) => void;
    onRemove: (tableId: string) => void;
  }) => {
    const handleSearch = useCallback(
      () => onSearch(tableId),
      [tableId, onSearch]
    );
    const handleDuplicate = useCallback(
      () => onDuplicate(tableId),
      [tableId, onDuplicate]
    );
    const handleRemove = useCallback(
      () => onRemove(tableId),
      [tableId, onRemove]
    );
    return (
      <ButtonGroup size="sm" isAttached>
        <Button colorScheme="green" onClick={handleSearch}>
          시간표 추가
        </Button>
        <Button colorScheme="green" mx="1px" onClick={handleDuplicate}>
          복제
        </Button>
        <Button
          colorScheme="green"
          isDisabled={disabled}
          onClick={handleRemove}
        >
          삭제
        </Button>
      </ButtonGroup>
    );
  }
);
const ScheduleTableItem = memo(
  ({
    tableId,
    schedules,
    index,
    disabledRemoveButton,
    onSearchOpen,
    onDuplicate,
    onRemove,
    onScheduleTimeClick,
    onDeleteButtonClick,
    onScheduleUpdate,
  }: {
    tableId: string;
    schedules: Schedule[];
    index: number;
    disabledRemoveButton: boolean;
    onSearchOpen: (tableId: string) => void;
    onDuplicate: (tableId: string) => void;
    onRemove: (tableId: string) => void;
    onScheduleTimeClick: (timeInfo: { day?: string; time?: number }) => void; // 변경!
    onDeleteButtonClick: ({ day, time }: { day: string; time: number }) => void; // 변경!
    onScheduleUpdate: (tableId: string, schedules: Schedule[]) => void;
  }) => {
    return (
      <DragStateProvider>
        <ScheduleDndProvider
          tableId={tableId}
          schedules={schedules}
          onScheduleUpdate={onScheduleUpdate}
        >
          <Stack width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">
                시간표 {index + 1}
              </Heading>
              <TableButtonGroup
                tableId={tableId}
                disabled={disabledRemoveButton}
                onSearch={onSearchOpen}
                onDuplicate={onDuplicate}
                onRemove={onRemove}
              />
            </Flex>
            <ScheduleTable
              schedules={schedules}
              tableId={tableId}
              onScheduleTimeClick={onScheduleTimeClick}
              onDeleteButtonClick={onDeleteButtonClick}
            />
          </Stack>
        </ScheduleDndProvider>
      </DragStateProvider>
    );
  }
);
const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  // 계산값 메모이제이션
  const disabledRemoveButton = useMemo(
    () => Object.keys(schedulesMap).length === 1,
    [schedulesMap]
  );

  const scheduleEntries = useMemo(
    () => Object.entries(schedulesMap),
    [schedulesMap]
  );

  // 핸들러 함수들 메모이제이션
  const duplicate = useCallback(
    (targetId: string) => {
      setSchedulesMap(prev => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    },
    [setSchedulesMap]
  );

  const remove = useCallback(
    (targetId: string) => {
      setSchedulesMap(prev => {
        delete prev[targetId];
        return { ...prev };
      });
    },
    [setSchedulesMap]
  );

  const handleSearchOpen = useCallback((tableId: string) => {
    setSearchInfo({ tableId });
  }, []);

  const handleScheduleUpdate = useCallback(
    (tableId: string, updatedSchedules: Schedule[]) => {
      setSchedulesMap(prev => ({
        ...prev,
        [tableId]: updatedSchedules,
      }));
    },
    [setSchedulesMap]
  );

  const handleSearchClose = useCallback(() => {
    setSearchInfo(null);
  }, []);

  // 각 테이블의 핸들러를 메모이제이션 - scheduleEntries 의존성 제거
  const tableHandlers = useMemo(() => {
    const handlers: Record<
      string,
      {
        onScheduleTimeClick: (timeInfo: {
          day?: string;
          time?: number;
        }) => void;
        onDeleteButtonClick: ({
          day,
          time,
        }: {
          day: string;
          time: number;
        }) => void;
      }
    > = {};

    Object.keys(schedulesMap).forEach(tableId => {
      handlers[tableId] = {
        onScheduleTimeClick: timeInfo => {
          setSearchInfo({ tableId, ...timeInfo });
        },
        onDeleteButtonClick: ({ day, time }) => {
          setSchedulesMap(prev => ({
            ...prev,
            [tableId]: prev[tableId].filter(
              schedule => schedule.day !== day || !schedule.range.includes(time)
            ),
          }));
        },
      };
    });

    return handlers;
  }, []); // 의존성 배열 비움!

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {scheduleEntries.map(([tableId, schedules], index) => (
          <ScheduleTableItem
            key={tableId}
            tableId={tableId}
            schedules={schedules}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            onSearchOpen={handleSearchOpen}
            onDuplicate={duplicate}
            onRemove={remove}
            onScheduleTimeClick={tableHandlers[tableId].onScheduleTimeClick}
            onDeleteButtonClick={tableHandlers[tableId].onDeleteButtonClick}
            onScheduleUpdate={handleScheduleUpdate}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleSearchClose} />
    </>
  );
};
export default ScheduleTables;
