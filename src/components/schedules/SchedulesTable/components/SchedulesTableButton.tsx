import { memo, useCallback } from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react/button';
import { store } from '../../../../store/schedules.store.ts';
export const SchedulesTableButton = memo(
  ({
    tableId,
    disabled,
    onSearch,
  }: {
    tableId: string;
    disabled: boolean;
    onSearch: (tableId: string) => void;
  }) => {
    const handleSearch = useCallback(
      () => onSearch(tableId),
      [tableId, onSearch]
    );

    const duplicate = useCallback((targetId: string) => {
      store.duplicateTable(targetId); // ← store 메서드 사용
    }, []);
    // const handleDuplicate = useCallback(
    //   () => onDuplicate(tableId),
    //   [tableId, onDuplicate]
    // );
    // const handleRemove = useCallback(
    //   () => onRemove(tableId),
    //   [tableId, onRemove]
    // );
    const remove = useCallback((targetId: string) => {
      store.removeTable(targetId);
    }, []);
    return (
      <ButtonGroup size="sm" isAttached>
        <Button colorScheme="green" onClick={handleSearch}>
          시간표 추가
        </Button>
        <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>
          복제
        </Button>
        <Button
          colorScheme="green"
          isDisabled={disabled}
          onClick={() => remove(tableId)}
        >
          삭제
        </Button>
      </ButtonGroup>
    );
  }
);
