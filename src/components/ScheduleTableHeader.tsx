import { Button, Flex, Heading } from '@chakra-ui/react';

import { ButtonGroup } from '@chakra-ui/react';
import { memo } from 'react';
import { useScheduleContext } from '../context/ScheduleContext.tsx';

interface Props {
  tableId: string;
  index: number;
  setSearchInfo: (searchInfo: { tableId: string; day?: string; time?: number }) => void;
  disabledRemoveButton: boolean;
}

const ScheduleTableHeader = memo(
  ({ disabledRemoveButton, tableId, index, setSearchInfo }: Props) => {
    const { duplicateTable, removeTable } = useScheduleContext();

    const remove = (targetId: string) => removeTable(targetId);

    const duplicate = (targetId: string) => duplicateTable(targetId);

    return (
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
          <Button
            colorScheme="green"
            isDisabled={disabledRemoveButton}
            onClick={() => remove(tableId)}
          >
            삭제
          </Button>
        </ButtonGroup>
      </Flex>
    );
  }
);

export default ScheduleTableHeader;
