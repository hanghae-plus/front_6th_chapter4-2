import {Flex} from '@chakra-ui/react'
import {useScheduleContext} from './ScheduleContext.tsx'
import SearchDialog from './SearchDialog.tsx'
import {useState} from 'react'
import ScheduleDndProvider from './ScheduleDndProvider.tsx'
import ScheduleTableWrapper from './components/ScheduleTableWrapper.tsx'

export const ScheduleTables = () => {
	const {schedulesMap, setSchedulesMap} = useScheduleContext()
	const [searchInfo, setSearchInfo] = useState<{
		tableId: string
		day?: string
		time?: number
	} | null>(null)

	const disabledRemoveButton = Object.keys(schedulesMap).length === 1

	return (
		<>
			<Flex w='full' gap={6} p={6} flexWrap='wrap'>
				{Object.entries(schedulesMap).map(([tableId, schedules], index) => (
					<ScheduleDndProvider key={tableId}>
						<ScheduleTableWrapper index={index} tableId={tableId} disabledRemoveButton={disabledRemoveButton} setSearchInfo={setSearchInfo} schedules={schedules} setSchedulesMap={setSchedulesMap} />
					</ScheduleDndProvider>
				))}
			</Flex>
			<SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
		</>
	)
}
