import {Stack} from '@chakra-ui/react'
import ScheduleTableHeader from './ScheduleTableHeader'
import ScheduleTable from '../ScheduleTable'
import {memo, useCallback} from 'react'
import {useSchedulesByTableId, useScheduleStore} from '../store/scheduleStore'

interface ScheduleTableWrapperProps {
	index: number
	tableId: string
	disabledRemoveButton: boolean
	setSearchInfo: (searchInfo: {tableId: string; day?: string; time?: number}) => void
}

export const ScheduleTableWrapper = memo(({index, tableId, setSearchInfo, disabledRemoveButton}: ScheduleTableWrapperProps) => {
	const schedules = useSchedulesByTableId(tableId)
	const removeScheduleFromTable = useScheduleStore((state) => state.removeScheduleFromTable)

	const handleDeleteButtonClick = useCallback(
		({day, time}: {day: string; time: number}) => {
			removeScheduleFromTable(tableId, day, time)
		},
		[removeScheduleFromTable, tableId]
	)

	const handleScheduleTimeClick = useCallback(
		(timeInfo: {day: string; time: number}) => {
			setSearchInfo({tableId, ...timeInfo})
		},
		[setSearchInfo, tableId]
	)

	return (
		<Stack width='600px'>
			<ScheduleTableHeader index={index} tableId={tableId} disabledRemoveButton={disabledRemoveButton} setSearchInfo={setSearchInfo} />

			<ScheduleTable schedules={schedules} tableId={tableId} onScheduleTimeClick={handleScheduleTimeClick} onDeleteButtonClick={handleDeleteButtonClick} />
		</Stack>
	)
})

export default ScheduleTableWrapper
