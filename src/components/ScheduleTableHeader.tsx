import { Button, ButtonGroup, Flex, Heading } from "@chakra-ui/react";
import { memo } from "react";
import { useScheduleStore } from "../store/scheduleStore";

interface ScheduleTableHeaderProps {
  index: number;
  tableId: string;
  setSearchInfo: (searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  }) => void;
  disabledRemoveButton: boolean;
}

export const ScheduleTableHeader = memo(
  ({
    index,
    tableId,
    disabledRemoveButton,
    setSearchInfo,
  }: ScheduleTableHeaderProps) => {
    const duplicateTable = useScheduleStore((state) => state.duplicateTable);
    const removeTable = useScheduleStore((state) => state.removeTable);
    return (
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button
            colorScheme="green"
            onClick={() => setSearchInfo({ tableId })}>
            시간표 추가
          </Button>
          <Button
            colorScheme="green"
            mx="1px"
            onClick={() => duplicateTable(tableId)}>
            복제
          </Button>
          <Button
            colorScheme="green"
            isDisabled={disabledRemoveButton}
            onClick={() => removeTable(tableId)}>
            삭제
          </Button>
        </ButtonGroup>
      </Flex>
    );
  }
);

export default ScheduleTableHeader;
