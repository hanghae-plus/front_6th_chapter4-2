import { memo, useCallback } from "react";
import { Button, ButtonGroup, Flex, Heading } from "@chakra-ui/react";
import { useScheduleSetter } from "./ScheduleContext.tsx";

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
    const setSchedulesMap = useScheduleSetter();

    // 🔃 불필요한 연산 최적화
    // useCallback으로 묶고, setSchedulesMap가 변할때만 재연산되도록 함
    const duplicate = useCallback(
      (targetId: string) => {
        setSchedulesMap((prev) => ({
          ...prev,
          [`schedule-${Date.now()}`]: [...prev[targetId]],
        }));
      },
      [setSchedulesMap]
    );

    // 🔃 불필요한 연산 최적화
    // useCallback으로 묶고, setSchedulesMap가 변할때만 재연산되도록 함
    const remove = useCallback(
      (targetId: string) => {
        setSchedulesMap((prev) => {
          delete prev[targetId];
          return { ...prev };
        });
      },
      [setSchedulesMap]
    );

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
