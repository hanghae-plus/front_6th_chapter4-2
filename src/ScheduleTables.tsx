import { Flex } from '@chakra-ui/react/flex';
import { Stack } from '@chakra-ui/react/stack';
import { Heading } from '@chakra-ui/react/typography';
import { Button, ButtonGroup } from '@chakra-ui/react/button';
import { useScheduleContext } from './ScheduleContext.tsx';
import React, { useState, useCallback, useMemo, lazy, memo } from 'react';

import ScheduleDndProvider from './ScheduleDndProvider.tsx';
import { DragStateProvider } from './SchedulesDragStateProvider.tsx';
import { Schedule } from './types.ts';
const ScheduleTable = lazy(() => import('./ScheduleTable'));

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
const SearchDialog = lazyWithPreloading(() => import('./SearchDialog'));

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
  }: {
    tableId: string;
    schedules: Schedule[];
    index: number;
    disabledRemoveButton: boolean;
    onSearchOpen: (tableId: string) => void;
    onDuplicate: (tableId: string) => void;
    onRemove: (tableId: string) => void;
    onScheduleTimeClick: (
      tableId: string
    ) => (timeInfo: { day?: string; time?: number }) => void;
    onDeleteButtonClick: (
      tableId: string
    ) => ({ day, time }: { day: string; time: number }) => void;
  }) => {
    return (
      <DragStateProvider>
        <ScheduleDndProvider>
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
              onScheduleTimeClick={onScheduleTimeClick(tableId)}
              onDeleteButtonClick={onDeleteButtonClick(tableId)}
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

  const handleScheduleTimeClick = useCallback(
    (tableId: string) => (timeInfo: { day?: string; time?: number }) => {
      setSearchInfo({ tableId, ...timeInfo });
    },
    []
  );

  const handleDeleteButtonClick = useCallback(
    (tableId: string) =>
      ({ day, time }: { day: string; time: number }) => {
        setSchedulesMap(prev => ({
          ...prev,
          [tableId]: prev[tableId].filter(
            schedule => schedule.day !== day || !schedule.range.includes(time)
          ),
        }));
      },
    [setSchedulesMap]
  );

  const handleSearchClose = useCallback(() => {
    setSearchInfo(null);
  }, []);

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
            onScheduleTimeClick={handleScheduleTimeClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleSearchClose} />
    </>
  );
};
export default ScheduleTables;
