import React, { ComponentProps, Fragment, useCallback, useState } from 'react';
import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	Grid,
	GridItem,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
	Text,
	Heading,
	Stack,
} from '@chakra-ui/react';
import { useDndContext, useDraggable } from '@dnd-kit/core';
import { CellSize, DAY_LABELS, 분 } from './constants.ts';
import { Lecture, Schedule } from './types.ts';
import { fill2, parseHnM, parseSchedule } from './utils.ts';
import { CSS } from '@dnd-kit/utilities';
import SearchDialog from './SearchDialog.tsx';

const TIMES = [
	...Array(18)
		.fill(0)
		.map((v, k) => v + k * 30 * 분)
		.map((v) => `${parseHnM(v)}~${parseHnM(v + 30 * 분)}`),

	...Array(6)
		.fill(18 * 30 * 분)
		.map((v, k) => v + k * 55 * 분)
		.map((v) => `${parseHnM(v)}~${parseHnM(v + 50 * 분)}`),
] as const;

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

	const getColor = (lectureId: string): string => {
		const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
		const colors = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];
		return colors[lectures.indexOf(lectureId) % colors.length];
	};

	const dndContext = useDndContext();
	// dndContext.active - 현재 드래그 중인 아이템 정보
	// dndContext.over - 현재 드롭 대상 요소 정보

	const getActiveTableId = () => {
		const activeId = dndContext.active?.id; // 현재 드래그 중인 아이템의 id
		if (activeId) {
			return String(activeId).split(':')[0]; // tableId string 값 추출
		}
		return null;
	};

	const activeTableId = getActiveTableId();

	// SearchDialog에서 강의 추가
	const addLecture = useCallback(
		(lecture: Lecture) => {
			if (!searchInfo) return;

			const newSchedules: Schedule[] = parseSchedule(lecture.schedule).map((s) => ({
				...s,
				lecture,
			}));

			setSchedules((prev) => [...prev, ...newSchedules]);
			setSearchInfo(null);
		},
		[searchInfo]
	);

	const deleteLecture = useCallback((day: string, time: number) => {
		setSchedules((prev) => prev.filter((s) => s.day !== day || !s.range.includes(time)));
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
			<Box position="relative" outline={activeTableId === tableId ? '5px dashed' : undefined} outlineColor="blue.300">
				<Grid
					templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
					templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
					bg="white"
					fontSize="sm"
					textAlign="center"
					outline="1px solid"
					outlineColor="gray.300"
				>
					<GridItem key="교시" borderColor="gray.300" bg="gray.100">
						<Flex justifyContent="center" alignItems="center" h="full" w="full">
							<Text fontWeight="bold">교시</Text>
						</Flex>
					</GridItem>
					{DAY_LABELS.map((day) => (
						<GridItem key={day} borderLeft="1px" borderColor="gray.300" bg="gray.100">
							<Flex justifyContent="center" alignItems="center" h="full">
								<Text fontWeight="bold">{day}</Text>
							</Flex>
						</GridItem>
					))}
					{TIMES.map((time, timeIndex) => (
						<Fragment key={`시간-${timeIndex + 1}`}>
							<GridItem borderTop="1px solid" borderColor="gray.300" bg={timeIndex > 17 ? 'gray.200' : 'gray.100'}>
								<Flex justifyContent="center" alignItems="center" h="full">
									<Text fontSize="xs">
										{fill2(timeIndex + 1)} ({time})
									</Text>
								</Flex>
							</GridItem>
							{DAY_LABELS.map((day) => (
								<GridItem
									key={`${day}-${timeIndex + 2}`}
									borderWidth="1px 0 0 1px"
									borderColor="gray.300"
									bg={timeIndex > 17 ? 'gray.100' : 'white'}
									cursor="pointer"
									_hover={{ bg: 'yellow.100' }}
									onClick={() => setSearchInfo({ tableId, day, time: timeIndex + 1 })}
								/>
							))}
						</Fragment>
					))}
				</Grid>

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
						addLecture={addLecture} // 모달에서 강의 추가 시 호출
					/>
				)}
			</Box>
		</Stack>
	);
});

// 단일 강의 아이템
const DraggableSchedule = ({
	id,
	data,
	bg,
	onDeleteButtonClick,
}: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
		onDeleteButtonClick: () => void;
	}) => {
	const { day, range, room, lecture } = data;

	const { attributes, setNodeRef, listeners, transform } = useDraggable({ id }); // 특정 아이템을 드래그 가능하게 설정
	// id - 드래그 아이템 구분
	// setNodeRef - 드래그할 노드 연결
	// listeners - 마우스/터치 이벤트 리스너
	// transform - 현재 드래그 중 이동 위치

	const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
	const topIndex = range[0] - 1;
	const size = range.length;

	return (
		<Popover>
			<PopoverTrigger>
				<Box
					position="absolute"
					left={`${120 + CellSize.WIDTH * leftIndex + 1}px`}
					top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
					width={CellSize.WIDTH - 1 + 'px'}
					height={CellSize.HEIGHT * size - 1 + 'px'}
					bg={bg}
					p={1}
					boxSizing="border-box"
					cursor="pointer"
					ref={setNodeRef}
					transform={CSS.Translate.toString(transform)}
					{...listeners}
					{...attributes}
				>
					<Text fontSize="sm" fontWeight="bold">
						{lecture.title}
					</Text>
					<Text fontSize="xs">{room}</Text>
				</Box>
			</PopoverTrigger>

			{/* 강의 삭제 모달 */}
			<PopoverContent onClick={(event) => event.stopPropagation()}>
				<PopoverArrow />
				<PopoverCloseButton />
				<PopoverBody>
					<Text>강의를 삭제하시겠습니까?</Text>
					<Button colorScheme="red" size="xs" onClick={onDeleteButtonClick}>
						삭제
					</Button>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export default ScheduleTable;
