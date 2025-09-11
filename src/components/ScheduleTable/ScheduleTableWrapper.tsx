import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleDndProvider from "../../ScheduleDndProvider.tsx";
import { Schedule } from "../../types.ts";
import ScheduleTable from "./ScheduleTable.tsx";
import { memo } from "react";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import { useInternalScheduleState } from "../../context/ScheduleStateContext.tsx";

interface ScheduleTableWrapperProps {
  tableId: string;
  index: number;
  schedules: Schedule[];
  setSearchInfo: (info: {
    tableId: string;
    day?: string;
    time?: number;
  }) => void;
  disabledRemoveButton: boolean;
}

export const ScheduleTableWrapper = memo(
  ({
    tableId,
    index,
    schedules,
    setSearchInfo,
    disabledRemoveButton,
  }: ScheduleTableWrapperProps) => {
    const setSchedulesMap = useInternalScheduleState();

    const duplicate = useAutoCallback((targetId: string) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    });

    const remove = useAutoCallback((targetId: string) => {
      setSchedulesMap((prev) => {
        delete prev[targetId];
        return { ...prev };
      });
    });

    return (
      <Stack
        key={tableId}
        width="600px"
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading
            as="h3"
            fontSize="lg"
          >
            시간표 {index + 1}
          </Heading>
          <ButtonGroup
            size="sm"
            isAttached
          >
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
        <ScheduleDndProvider>
          <ScheduleTable
            key={`schedule-table-${index}`}
            schedules={schedules}
            tableId={tableId}
            onScheduleTimeClick={(timeInfo) =>
              setSearchInfo({ tableId, ...timeInfo })
            }
            onDeleteButtonClick={() => {
              // deleteSchedule는 ScheduleTable 컴포넌트 내부에서 처리됨
            }}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  }
);

ScheduleTableWrapper.displayName = "ScheduleTableWrapper";
