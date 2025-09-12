import {GridItem} from '@chakra-ui/react'
import {memo, useCallback} from 'react'

export const ScheduleTableCell = memo(({day, timeIndex, onScheduleTimeClick}: {day: string; timeIndex: number; onScheduleTimeClick?: (timeInfo: {day: string; time: number}) => void}) => {
	const handleClick = useCallback(() => {
		onScheduleTimeClick?.({day, time: timeIndex + 1})
	}, [day, timeIndex, onScheduleTimeClick])

	return <GridItem key={`${day}-${timeIndex + 2}`} borderWidth='1px 0 0 1px' borderColor='gray.300' bg={timeIndex > 17 ? 'gray.100' : 'white'} cursor='pointer' _hover={{bg: 'yellow.100'}} onClick={handleClick} />
})
