import {Box, Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Text} from '@chakra-ui/react'
import {CellSize, DAY_LABELS} from './constants.ts'
import {Schedule} from './types.ts'
import {useDndContext, useDraggable} from '@dnd-kit/core'
import {CSS} from '@dnd-kit/utilities'
import {ComponentProps, memo, useCallback, useMemo} from 'react'
import {ScheduleTableGrid} from './components/ScheduleTableGrid.tsx'

interface Props {
	tableId: string
	schedules: Schedule[]
	onScheduleTimeClick?: (timeInfo: {day: string; time: number}) => void
	onDeleteButtonClick?: (timeInfo: {day: string; time: number}) => void
}

const TableOutline = memo(({tableId}: {tableId: string}) => {
	const dndContext = useDndContext()

	const activeTableId = useMemo(() => {
		const activeId = dndContext.active?.id
		if (activeId) {
			return String(activeId).split(':')[0]
		}
		return null
	}, [dndContext.active?.id])

	return <Box position='absolute' top='0' left='0' right='0' bottom='0' outline={activeTableId === tableId ? '5px dashed' : undefined} outlineColor='blue.300' pointerEvents='none' />
})

const ScheduleTable = ({tableId, schedules, onScheduleTimeClick, onDeleteButtonClick}: Props) => {
	const getColor = useCallback(
		(lectureId: string): string => {
			const lectures = [...new Set(schedules.map(({lecture}) => lecture.id))]
			const colors = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd']
			return colors[lectures.indexOf(lectureId) % colors.length]
		},
		[schedules]
	)

	// 이벤트 콜백 함수 메모이제이션
	const memoizedOnScheduleTimeClick = useCallback(
		(timeInfo: {day: string; time: number}) => {
			onScheduleTimeClick?.(timeInfo)
		},
		[onScheduleTimeClick]
	)

	const memoizedOnDeleteButtonClick = useCallback(
		(timeInfo: {day: string; time: number}) => {
			onDeleteButtonClick?.(timeInfo)
		},
		[onDeleteButtonClick]
	)

	return (
		<Box position='relative'>
			<ScheduleTableGrid memoizedOnScheduleTimeClick={memoizedOnScheduleTimeClick} />
			<TableOutline tableId={tableId} />
			{schedules.map((schedule, index) => (
				<DraggableSchedule
					key={`${schedule.lecture.title}-${index}`}
					id={`${tableId}:${index}`}
					data={schedule}
					bg={getColor(schedule.lecture.id)}
					onDeleteButtonClick={() =>
						memoizedOnDeleteButtonClick?.({
							day: schedule.day,
							time: schedule.range[0]
						})
					}
				/>
			))}
		</Box>
	)
}

const DraggableSchedule = memo(
	({
		id,
		data,
		bg,
		onDeleteButtonClick
	}: {id: string; data: Schedule} & ComponentProps<typeof Box> & {
			onDeleteButtonClick: () => void
		}) => {
		const {day, range, room, lecture} = data
		const {attributes, setNodeRef, listeners, transform, isDragging} = useDraggable({id})
		const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number])
		const topIndex = range[0] - 1
		const size = range.length

		// 드래그 중일 때는 강의 삭제 모달도 같이 리랜더링이 되지 않게
		const shouldRenderPopover = !isDragging

		return (
			<Popover>
				<PopoverTrigger>
					<Box position='absolute' left={`${120 + CellSize.WIDTH * leftIndex + 1}px`} top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`} width={CellSize.WIDTH - 1 + 'px'} height={CellSize.HEIGHT * size - 1 + 'px'} bg={bg} p={1} boxSizing='border-box' cursor='pointer' ref={setNodeRef} transform={CSS.Translate.toString(transform)} {...listeners} {...attributes}>
						<Text fontSize='sm' fontWeight='bold'>
							{lecture.title}
						</Text>
						<Text fontSize='xs'>{room}</Text>
					</Box>
				</PopoverTrigger>
				{shouldRenderPopover && (
					<PopoverContent onClick={(event) => event.stopPropagation()}>
						<PopoverArrow />
						<PopoverCloseButton />
						<PopoverBody>
							<Text>강의를 삭제하시겠습니까?</Text>
							<Button colorScheme='red' size='xs' onClick={onDeleteButtonClick}>
								삭제
							</Button>
						</PopoverBody>
					</PopoverContent>
				)}
			</Popover>
		)
	}
)

export default ScheduleTable
