import { useCallback } from 'react';
import { Flex } from '@chakra-ui/react';
import { Schedule } from './types.ts';
import { useScheduleContext } from './ScheduleContext.tsx';
import ScheduleTable from './ScheduleTable.tsx';

export const ScheduleTables = () => {
	// 시간표 배열 - 전역 상태
	const { schedulesMap, setSchedulesMap } = useScheduleContext();

	// schedulesMap의 길이가 1일 때 삭제 불가능 처리 - 최소 시간표가 하나는 있어야 함
	const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

	// 시간표 복제
	const duplicate = useCallback(
		(tableId: string, currentSchedules: Schedule[]) => {
			// 복제 전에 context 동기화
			setSchedulesMap((prev) => ({
				...prev,
				[tableId]: currentSchedules, // 현재 시간표 상태 반영
				[`schedule-${Date.now()}`]: [...currentSchedules],
			}));
		},
		[setSchedulesMap]
	);

	// 시간표 삭제
	const remove = useCallback(
		(tableId: string) => {
			setSchedulesMap((prev) => {
				const copy = { ...prev };
				delete copy[tableId];
				return copy;
			});
		},
		[setSchedulesMap]
	);

	return (
		<>
			<Flex w="full" gap={6} p={6} flexWrap="wrap">
				{Object.entries(schedulesMap).map(([tableId, schedules], index) => (
					<ScheduleTable
						index={index}
						disabled={disabledRemoveButton}
						key={tableId}
						tableId={tableId}
						initialSchedule={schedules}
						onDuplicate={duplicate}
						onRemove={remove}
					/>
				))}
			</Flex>
		</>
	);
};
