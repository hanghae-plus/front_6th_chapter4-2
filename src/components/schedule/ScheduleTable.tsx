import React, { useCallback, useState } from 'react';
import { Box, Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import { Active } from '@dnd-kit/core';
import { DAY_LABELS } from '../../constants.ts';
import { Lecture, Schedule } from '../../types.ts';
import { parseSchedule } from '../../utils.ts';
import ScheduleDndProvider from '../../provider/ScheduleDndProvider.tsx';
import DraggableSchedule from './DraggableSchedule.tsx';
import ScheduleTemplate from './ScheduleTemplate.tsx';
import SearchDialog from '../dialog/SearchDialog.tsx';

interface Props {
  index: number;
  disabled: boolean;
  tableId: string;
  initialSchedule: Schedule[];
  onDuplicate: (tableId: string, currentSchedules: Schedule[]) => void;
  onRemove: (tableId: string) => void;
}

const ScheduleTable = React.memo(({ index, disabled, tableId, initialSchedule, onDuplicate, onRemove }: Props) => {
  // 시간표 개별 상태 관리
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedule);
  // 현재 선택된 강의 정보 - 시간표 id, 요일, 시간
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const [isActive, setIsActive] = useState<Active | null>(null);

  const getColor = (lectureId: string): string => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];
    return colors[lectures.indexOf(lectureId) % colors.length];
  };

  // 드래그 시작 시 active 업데이트
  const handleDragStart = ({ active }: { active: Active }) => {
    setIsActive(active);
  };

  // 드래그 종료 시 호출
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    // active - 드래그한 아이템
    // delta - 이동 거리
    const { active, delta } = event;
    // 드래그 종료 시 active 제거
    setIsActive(null);

    const { x, y } = delta;
    const [, index] = active.id.split(':');
    const schedule = schedules[index];
    const nowDayIndex = DAY_LABELS.indexOf(schedule.day as (typeof DAY_LABELS)[number]);

    // 이동한 그리드 계산
    const moveDayIndex = Math.floor(x / 80);
    const moveTimeIndex = Math.floor(y / 30);

    setSchedules((prev) =>
      prev.map((schedule, idx) =>
        idx === Number(index)
          ? {
              ...schedule,
              day: DAY_LABELS[nowDayIndex + moveDayIndex],
              range: schedule.range.map((time) => time + moveTimeIndex),
            }
          : { ...schedule }
      )
    );
  };

  // SearchDialog에서 강의 추가
  const addLecture = useCallback(
    (lecture: Lecture) => {
      if (!searchInfo) return;

      const newSchedules: Schedule[] = parseSchedule(lecture.schedule).map((schedule) => ({
        ...schedule,
        lecture,
      }));

      setSchedules((prev) => [...prev, ...newSchedules]);
      setSearchInfo(null); // 모달 닫기
    },
    [searchInfo]
  );

  // 강의 삭제
  const deleteLecture = useCallback((day: string, time: number) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.day !== day || !schedule.range.includes(time)));
  }, []);

  return (
    <Stack key={tableId} width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>
            시간표 추가
          </Button>
          <Button colorScheme="green" mx="1px" onClick={() => onDuplicate(tableId, schedules)}>
            복제
          </Button>
          <Button colorScheme="green" isDisabled={disabled} onClick={() => onRemove(tableId)}>
            삭제
          </Button>
        </ButtonGroup>
      </Flex>

      {/* DnDContext 적용 */}
      <ScheduleDndProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Box position="relative" outline={isActive ? '5px dashed' : undefined} outlineColor="blue.300">
          <ScheduleTemplate tableId={tableId} onCellClick={setSearchInfo} />

          {schedules.map((schedule, index) => (
            <DraggableSchedule
              key={`${schedule.lecture.title}-${index}`}
              id={`${tableId}:${index}`}
              data={schedule}
              bg={getColor(schedule.lecture.id)}
              onDeleteButtonClick={() => deleteLecture(schedule.day, schedule.range[0])}
            />
          ))}

          {searchInfo?.tableId === tableId && (
            <SearchDialog
              searchInfo={searchInfo}
              onClose={() => setSearchInfo(null)}
              addLecture={addLecture} // 모달에서 강의 추가
            />
          )}
        </Box>
      </ScheduleDndProvider>
    </Stack>
  );
});

export default ScheduleTable;
