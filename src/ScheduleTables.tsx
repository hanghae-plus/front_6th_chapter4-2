import { useState } from 'react';
import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import { useScheduleContext } from './ScheduleContext.tsx';
import ScheduleTable from './ScheduleTable.tsx';
import SearchDialog from './SearchDialog.tsx';

export const ScheduleTables = () => {
  // 시간표 배열
	const { schedulesMap, setSchedulesMap } = useScheduleContext();

  // 현재 선택된 강의 정보 - 시간표 id, 요일, 시간
	const [searchInfo, setSearchInfo] = useState<{
		tableId: string;
		day?: string;
		time?: number;
	} | null>(null);

  // schedulesMap의 길이가 1일 때 삭제 불가능 처리 - 최소 시간표가 하나는 있어야 한다?
	const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  // 시간표 복제 - schedulesMap의 키 값을 인자로 받아 시간표 복제
	const duplicate = (targetId: string) => {
		setSchedulesMap((prev) => ({
			...prev,
			[`schedule-${Date.now()}`]: [...prev[targetId]],
		}));
	};

  // 시간표 삭제 - schedulesMap의 키 값을 인자로 받아 시간표 삭제`₩
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
								<Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>
									시간표 추가
								</Button>
								<Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>
									복제
								</Button>
								<Button colorScheme="green" isDisabled={disabledRemoveButton} onClick={() => remove(tableId)}>
									삭제
								</Button>
							</ButtonGroup>
						</Flex>

						{/* 시간표 컴포넌트 */}
						<ScheduleTable
							key={`schedule-table-${index}`}
							schedules={schedules}
							tableId={tableId}
							onScheduleTimeClick={(timeInfo) => setSearchInfo({ tableId, ...timeInfo })}
							onDeleteButtonClick={({ day, time }) =>
                // 시간표에서 클릭한 요일과 시간이 일치하는 강의 삭제
								setSchedulesMap((prev) => ({
									...prev,
									[tableId]: prev[tableId].filter((schedule) => schedule.day !== day || !schedule.range.includes(time)),
								}))
							}
						/>
					</Stack>
				))}
			</Flex>

      {/* searchInfo가 null이 아니면 검색 dialog가 보여짐 */}
			<SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
		</>
	);
};
