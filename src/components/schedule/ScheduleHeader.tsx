import { Button, ButtonGroup, Flex, Heading } from "@chakra-ui/react";
import { memo } from "react";

interface Props {
  index: number;
  onAddButtonClick: () => void;
  onDuplicateTableClick: () => void;
  onRemoveTableClick: () => void;
  disabledRemoveButton: boolean;
}

export const ScheduleHeader = memo(
  ({
    index,
    onAddButtonClick,
    onDuplicateTableClick,
    onRemoveTableClick,
    disabledRemoveButton,
  }: Props) => {
    return (
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={onAddButtonClick}>
            시간표 추가
          </Button>
          <Button colorScheme="green" mx="1px" onClick={onDuplicateTableClick}>
            복제
          </Button>
          <Button
            colorScheme="green"
            isDisabled={disabledRemoveButton}
            onClick={onRemoveTableClick}
          >
            삭제
          </Button>
        </ButtonGroup>
      </Flex>
    );
  }
);

ScheduleHeader.displayName = "ScheduleHeader";
