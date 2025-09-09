import { memo } from "react";
import { Button, ButtonGroup, Flex, Heading } from "@chakra-ui/react";

interface ScheduleTableHeaderProps {
  index: number;
  setSearchInfo: (searchInfo: { tableId: string }) => void;
  duplicate: (tableId: string) => void;
  disabledRemoveButton: boolean;
  remove: (tableId: string) => void;
  tableId: string;
}

export const ScheduleTableHeader = memo(
  ({
    index,
    setSearchInfo,
    duplicate,
    disabledRemoveButton,
    remove,
    tableId,
  }: ScheduleTableHeaderProps) => {
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
            onClick={() => duplicate(tableId)}
          >
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
