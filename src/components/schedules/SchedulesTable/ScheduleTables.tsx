import { Flex } from '@chakra-ui/react/flex';

import { useMemo, useSyncExternalStore } from 'react';

import { ScheduleTableContainer } from './components';
import { store } from '../../../store/schedules.store.ts';
import SearchDialog from '../SearchDialog/SearchDialog.tsx';

const ScheduleTables = () => {
  // 테이블 ID 목록만 구독
  const tableIds = useSyncExternalStore(
    callback => store.subscribeToTableIds(callback),
    () => store.getTableIds()
  );

  // 계산값 메모이제이션
  const disabledRemoveButton = useMemo(() => tableIds.length === 1, [tableIds]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <ScheduleTableContainer
            key={tableId}
            tableId={tableId}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
          />
        ))}
      </Flex>
      <SearchDialog />
    </>
  );
};
export default ScheduleTables;
