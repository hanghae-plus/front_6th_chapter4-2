import { Flex } from '@chakra-ui/react/flex';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { Schedule } from '../../../types.ts';
import { ScheduleTableContainer } from './components';
import { store } from '../../../store/schedules.store.ts';
import dummyScheduleMap from '../../../mocks/dummyScheduleMap.ts';
import SearchDialog from '../SearchDialog/SearchDialog.tsx';
import { searchInfoStore } from '../../../store/searchInfo.store.ts';

const ScheduleTables = () => {
  const schedulesMap = useSyncExternalStore(
    callback => store.subscribeAll(callback),
    () => store.getSchedulesMap(),
    () => dummyScheduleMap
  );
  const scheduleEntries = Object.entries(schedulesMap);

  // 계산값 메모이제이션
  const disabledRemoveButton = useMemo(
    () => Object.keys(schedulesMap).length === 1,
    [schedulesMap]
  );

  const handleSearchOpen = (tableId: string) =>
    searchInfoStore.setSearchInfo({ tableId });

  const duplicate = useCallback((targetId: string) => {
    store.duplicateTable(targetId); // ← store 메서드 사용
  }, []);

  const remove = useCallback((targetId: string) => {
    store.removeTable(targetId); // ← store 메서드 사용
  }, []);

  const handleScheduleUpdate = useCallback(
    (tableId: string, updatedSchedules: Schedule[]) => {
      store.updateTable(tableId, updatedSchedules);
    },
    []
  );

  const handleScheduleTimeClick = useCallback(
    (tableId: string, timeInfo: { day?: string; time?: number }) => {
      searchInfoStore.setSearchInfo({ tableId, ...timeInfo });
    },
    []
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {scheduleEntries.map(([tableId], index) => (
          <ScheduleTableContainer
            key={tableId}
            tableId={tableId}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            onSearchOpen={handleSearchOpen}
            onDuplicate={duplicate}
            onRemove={remove}
            onScheduleTimeClick={timeInfo =>
              handleScheduleTimeClick(tableId, timeInfo)
            }
            onScheduleUpdate={handleScheduleUpdate}
          />
        ))}
      </Flex>
      <SearchDialog />
    </>
  );
};
export default ScheduleTables;
