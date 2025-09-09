/**
 * 여러 시간표를 관리하고 표시하는 컨테이너 컴포넌트
 * 시간표 추가, 복제, 삭제 기능과 강의 검색 다이얼로그를 제공합니다.
 */
import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import { SearchDialog } from "./SearchDialog/SearchDialog.tsx";
import { SearchInfo } from "./SearchDialog/types.ts";
import { useState } from "react";

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  // 시간표 복제 기능
  const duplicate = (targetId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  };

  // 시간표 삭제 기능
  const remove = (targetId: string) => {
    setSchedulesMap((prev) => {
      delete prev[targetId];
      return { ...prev };
    });
  };

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <Stack key={tableId} width="600px">
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
            <ScheduleTable
              key={`schedule-table-${index}`}
              schedules={schedules}
              tableId={tableId}
              onScheduleTimeClick={(timeInfo) =>
                setSearchInfo({ tableId, ...timeInfo })
              }
              onDeleteButtonClick={({ day, time }) =>
                setSchedulesMap((prev) => ({
                  ...prev,
                  [tableId]: prev[tableId].filter(
                    (schedule) =>
                      schedule.day !== day || !schedule.range.includes(time)
                  ),
                }))
              }
            />
          </Stack>
        ))}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
};
