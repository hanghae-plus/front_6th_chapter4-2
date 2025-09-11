import { Flex, Heading, ButtonGroup, Button } from "@chakra-ui/react";
import { memo } from "react";

interface ScheduleTableHeaderProps {
  index: number;
  duplicate: () => void;
  remove: () => void;
  handleSearchClick: () => void;
  disabledRemoveButton: boolean;
}

const ScheduleTableHeader = ({
  index,
  duplicate,
  remove,
  handleSearchClick,
  disabledRemoveButton,
}: ScheduleTableHeaderProps) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading as="h3" fontSize="lg">
        시간표 {index + 1}
      </Heading>
      <ButtonGroup size="sm" isAttached>
        <Button colorScheme="green" onClick={handleSearchClick}>
          시간표 추가
        </Button>
        <Button colorScheme="green" mx="1px" onClick={duplicate}>
          복제
        </Button>
        <Button
          colorScheme="green"
          isDisabled={disabledRemoveButton}
          onClick={remove}
        >
          삭제
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

ScheduleTableHeader.displayName = "ScheduleTableHeader";

export default memo(ScheduleTableHeader);
