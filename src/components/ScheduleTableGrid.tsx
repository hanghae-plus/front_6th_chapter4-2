import {Flex, Grid, GridItem, Text} from '@chakra-ui/react'
import {Fragment, memo} from 'react'
import {CellSize, DAY_LABELS, TIMES} from '../constants'
import {DayHeaderCell} from './ScheduleTableDayHeader'
import {ScheduleTableTimeCell} from './ScheduleTableTimeCell'
import {ScheduleTableCell} from './ScheduleTableCell'

export const ScheduleTableGrid = memo(({memoizedOnScheduleTimeClick}: {memoizedOnScheduleTimeClick?: (timeInfo: {day: string; time: number}) => void}) => {
	return (
		<Grid templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`} templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`} bg='white' fontSize='sm' textAlign='center' outline='1px solid' outlineColor='gray.300' className='qkqkqk'>
			<GridItem key='교시' borderColor='gray.300' bg='gray.100'>
				<Flex justifyContent='center' alignItems='center' h='full' w='full'>
					<Text fontWeight='bold'>교시</Text>
				</Flex>
			</GridItem>
			{DAY_LABELS.map((day) => (
				<DayHeaderCell key={day} day={day} />
			))}
			{TIMES.map((time, timeIndex) => (
				<Fragment key={`시간-${timeIndex + 1}`}>
					<ScheduleTableTimeCell time={time} timeIndex={timeIndex} />
					{DAY_LABELS.map((day) => (
						<ScheduleTableCell key={`${day}-${timeIndex + 2}`} day={day} timeIndex={timeIndex} onScheduleTimeClick={memoizedOnScheduleTimeClick} />
					))}
				</Fragment>
			))}
		</Grid>
	)
})
