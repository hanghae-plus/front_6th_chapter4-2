import { memo } from "react";
import { Button, ButtonGroup, Flex, Heading } from "@chakra-ui/react";
import { scheduleStore } from "./store/schedule.store.ts";

interface ScheduleTableHeaderProps {
  index: number;
  setSearchInfo: (searchInfo: { tableId: string }) => void;
  disabledRemoveButton: boolean;
  tableId: string;
}

export const ScheduleTableHeader = memo(
  ({
    index,
    setSearchInfo,
    disabledRemoveButton,
    tableId,
  }: ScheduleTableHeaderProps) => {
    const duplicateTable = scheduleStore.duplicateTable;
    const deleteTable = scheduleStore.deleteTable;

    return (
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button
            colorScheme="green"
            onClick={() => setSearchInfo({ tableId })}
          >
            시간표 추가
          </Button>
          <Button
            colorScheme="green"
            mx="1px"
            onClick={() => duplicateTable(tableId)}
          >
            복제
          </Button>
          <Button
            colorScheme="green"
            isDisabled={disabledRemoveButton}
            onClick={() => deleteTable(tableId)}
          >
            삭제
          </Button>
        </ButtonGroup>
      </Flex>
    );
  }
);
