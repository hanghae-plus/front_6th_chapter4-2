import { Flex } from '@chakra-ui/react/flex';
import { Stack } from '@chakra-ui/react/stack';
import { Heading } from '@chakra-ui/react/typography';
import { Button, ButtonGroup } from '@chakra-ui/react/button';
import { useScheduleContext } from './ScheduleContext.tsx';
import { useState, useCallback, useMemo, lazy, memo } from 'react';
const SearchDialog = lazy(() => import('./SearchDialog.tsx'));
const ScheduleTable = lazy(() => import('./ScheduleTable'));

const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  // 계산값 메모이제이션
  const disabledRemoveButton = useMemo(
    () => Object.keys(schedulesMap).length === 1,
    [schedulesMap]
  );

  const scheduleEntries = useMemo(
    () => Object.entries(schedulesMap),
    [schedulesMap]
  );

  // 핸들러 함수들 메모이제이션
  const duplicate = useCallback(
    (targetId: string) => {
      setSchedulesMap(prev => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    },
    [setSchedulesMap]
  );

  const remove = useCallback(
    (targetId: string) => {
      setSchedulesMap(prev => {
        delete prev[targetId];
        return { ...prev };
      });
    },
    [setSchedulesMap]
  );

  const handleSearchOpen = (tableId: string) => {
    setSearchInfo({ tableId });
  };

  const handleScheduleTimeClick = useCallback(
    (tableId: string) => (timeInfo: { day?: string; time?: number }) => {
      setSearchInfo({ tableId, ...timeInfo });
    },
    []
  );

  const handleDeleteButtonClick = useCallback(
    (tableId: string) =>
      ({ day, time }: { day: string; time: number }) => {
        setSchedulesMap(prev => ({
          ...prev,
          [tableId]: prev[tableId].filter(
            schedule => schedule.day !== day || !schedule.range.includes(time)
          ),
        }));
      },
    [setSchedulesMap]
  );

  const MemoizedButtonGroup = memo(
    ({ tableId, disabled }: { tableId: string; disabled: boolean }) => {
      return (
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={() => handleSearchOpen(tableId)}>
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
            isDisabled={disabled}
            onClick={() => remove(tableId)}
          >
            삭제
          </Button>
        </ButtonGroup>
      );
    }
  );

  const handleSearchClose = useCallback(() => {
    setSearchInfo(null);
  }, []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {scheduleEntries.map(([tableId, schedules], index) => (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">
                시간표 {index + 1}
              </Heading>
              <MemoizedButtonGroup
                tableId={tableId}
                disabled={disabledRemoveButton}
              />
            </Flex>
            <ScheduleTable
              schedules={schedules}
              tableId={tableId}
              onScheduleTimeClick={handleScheduleTimeClick(tableId)}
              onDeleteButtonClick={handleDeleteButtonClick(tableId)}
            />
          </Stack>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleSearchClose} />
    </>
  );
};
export default ScheduleTables;
