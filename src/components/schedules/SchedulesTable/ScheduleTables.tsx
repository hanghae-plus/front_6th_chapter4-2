import { Flex } from '@chakra-ui/react/flex';
import { useScheduleContext } from '../../../ScheduleContext.tsx';
import { useState, useCallback, useMemo } from 'react';
import { Schedule } from '../../../types.ts';
import { ScheduleTableContainer } from './components';
import { lazyWithPreloading } from '../../../lib/lazyWithPreloading.ts';
import { store } from '../../../store/externalStore.ts';
const SearchDialog = lazyWithPreloading(
  () => import('../SearchDialog/SearchDialog.tsx')
);

const ScheduleTables = () => {
  const {
    // schedulesMap,
    setSchedulesMap,
  } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);
  const schedulesMap = store.getSchedulesMap();
  const scheduleEntries = Object.entries(schedulesMap);
  // 계산값 메모이제이션
  const disabledRemoveButton = useMemo(
    () => Object.keys(schedulesMap).length === 1,
    [schedulesMap]
  );

  // const scheduleEntries = useMemo(
  //   () => Object.entries(schedulesMap),
  //   [schedulesMap]
  // );

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

  // const handleScheduleUpdate = useCallback(
  //   (tableId: string, updatedSchedules: Schedule[]) => {
  //     setSchedulesMap(prev => {
  //       const next: Record<string, Schedule[]> = {};
  //       for (const key of Object.keys(prev)) {
  //         next[key] = key === tableId ? updatedSchedules : prev[key];
  //       }
  //       return next;
  //     });
  //   },
  //   [setSchedulesMap]
  // );

  const handleScheduleUpdate = useCallback(
    (tableId: string, updatedSchedules: Schedule[]) => {
      store.updateTable(tableId, updatedSchedules);
    },
    []
  );
  const handleSearchClose = useCallback(() => {
    setSearchInfo(null);
  }, []);

  // const tableHandlers = useMemo(() => {
  //   const handlers: Record<
  //     string,
  //     {
  //       onScheduleTimeClick: (timeInfo: {
  //         day?: string;
  //         time?: number;
  //       }) => void;
  //       onDeleteButtonClick: ({
  //         day,
  //         time,
  //       }: {
  //         day: string;
  //         time: number;
  //       }) => void;
  //     }
  //   > = {};
  //
  //   Object.keys(schedulesMap).forEach(tableId => {
  //     handlers[tableId] = {
  //       onScheduleTimeClick: timeInfo => {
  //         setSearchInfo({ tableId, ...timeInfo });
  //       },
  //       onDeleteButtonClick: ({ day, time }) => {
  //         setSchedulesMap(prev => ({
  //           ...prev,
  //           [tableId]: prev[tableId].filter(
  //             schedule => schedule.day !== day || !schedule.range.includes(time)
  //           ),
  //         }));
  //       },
  //     };
  //   });
  //   return handlers;
  // }, []);

  const handleScheduleTimeClick = useCallback(
    (tableId: string, timeInfo: { day?: string; time?: number }) => {
      setSearchInfo({ tableId, ...timeInfo });
    },
    []
  );

  const handleDeleteButtonClick = useCallback(
    (tableId: string, { day, time }: { day: string; time: number }) => {
      setSchedulesMap(prev => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          schedule => schedule.day !== day || !schedule.range.includes(time)
        ),
      }));
    },
    [setSchedulesMap]
  );
  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {scheduleEntries.map(([tableId, schedules], index) => (
          <ScheduleTableContainer
            key={tableId}
            tableId={tableId}
            schedules={schedules}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            onSearchOpen={handleSearchOpen}
            onDuplicate={duplicate}
            onRemove={remove}
            // onScheduleTimeClick={tableHandlers[tableId].onScheduleTimeClick}
            // onDeleteButtonClick={tableHandlers[tableId].onDeleteButtonClick}

            onScheduleTimeClick={timeInfo =>
              handleScheduleTimeClick(tableId, timeInfo)
            }
            onDeleteButtonClick={timeInfo =>
              handleDeleteButtonClick(tableId, timeInfo)
            }
            onScheduleUpdate={handleScheduleUpdate}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleSearchClose} />
    </>
  );
};
export default ScheduleTables;
