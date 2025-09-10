import { Flex } from '@chakra-ui/react/flex';
import { useScheduleContext } from '../../../ScheduleContext.tsx';
import { useState, useCallback, useMemo } from 'react';
import { Schedule } from '../../../types.ts';
import { ScheduleTableContainer } from './components';
import { lazyWithPreloading } from '../../../lib/lazyWithPreloading.ts';
const SearchDialog = lazyWithPreloading(
  () => import('../SearchDialog/SearchDialog.tsx')
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
      setSchedulesMap(
        prev => {
          const next: Record<string, Schedule[]> = {};
          for (const key of Object.keys(prev)) {
            next[key] = key === tableId ? updatedSchedules : prev[key];
          }
          return next;
        }
        //   ({
        //   ...prev,
        //   [tableId]: updatedSchedules,
        // })
      );
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
          <ScheduleTableContainer
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
