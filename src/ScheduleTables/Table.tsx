import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { memo } from "react";
import { useSchedules } from "../hook/useSchedules.ts";
import ScheduleDndProvider from "../ScheduleDndProvider.tsx";
import ScheduleTable from "../ScheduleTable/ScheduleTable.tsx";
import type { Schedule } from "../types.ts";

interface Props {
	tableId: string;
	index: number;
	schedules: Schedule[];
	disabledRemoveButton: boolean;
	setSearchInfo: (searchInfo: { tableId: string }) => void;
}

const Table = ({
	tableId,
	index,
	schedules,
	disabledRemoveButton,
	setSearchInfo,
}: Props) => {
	const setSchedulesMap = useSchedules((state) => state.setSchedulesMap);

	const duplicate = (targetId: string) => {
		setSchedulesMap((prev) => ({
			...prev,
			[`schedule-${Date.now()}`]: [...prev[targetId]],
		}));
	};

	const remove = (targetId: string) => {
		setSchedulesMap((prev) => {
			delete prev[targetId];
			return { ...prev };
		});
	};

	return (
		<Stack width="600px">
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
			<ScheduleDndProvider>
				<ScheduleTable
					// biome-ignore lint/suspicious/noArrayIndexKey: 다른 값 사용가능한지 확인하기
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
									schedule.day !== day || !schedule.range.includes(time),
							),
						}))
					}
				/>
			</ScheduleDndProvider>
		</Stack>
	);
};

export default memo(Table);
