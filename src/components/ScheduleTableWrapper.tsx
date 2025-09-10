import {Stack} from '@chakra-ui/react'
import ScheduleTableHeader from './ScheduleTableHeader'
import ScheduleTable from '../ScheduleTable'
import {memo} from 'react'
import {Schedule} from '../types'
import React from 'react'

interface ScheduleTableWrapperProps {
	index: number
	tableId: string
	disabledRemoveButton: boolean
	setSearchInfo: (searchInfo: {tableId: string; day?: string; time?: number}) => void
	schedules: Schedule[]
	setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>
}

export const ScheduleTableWrapper = memo(({index, schedules, tableId, setSearchInfo, setSchedulesMap, disabledRemoveButton}: ScheduleTableWrapperProps) => {
	return (
		<Stack width='600px'>
			<ScheduleTableHeader index={index} tableId={tableId} disabledRemoveButton={disabledRemoveButton} setSearchInfo={setSearchInfo} />

			<ScheduleTable
				schedules={schedules}
				tableId={tableId}
				onDeleteButtonClick={({day, time}) =>
					setSchedulesMap((prev) => ({
						...prev,
						[tableId]: prev[tableId].filter((schedule) => schedule.day !== day || !schedule.range.includes(time))
					}))
				}
			/>
		</Stack>
	)
})

export default ScheduleTableWrapper
