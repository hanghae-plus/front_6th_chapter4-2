import { memo, useCallback } from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react/button';
export const SchedulesTableButton = memo(
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
