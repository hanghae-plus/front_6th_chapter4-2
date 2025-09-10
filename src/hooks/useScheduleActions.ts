import {useScheduleContext} from '../ScheduleContext'

export const useScheduleActions = () => {
	const {setSchedulesMap} = useScheduleContext()

	const duplicate = (targetId: string) => {
		setSchedulesMap((prev) => ({
			...prev,
			[`schedule-${Date.now()}`]: [...prev[targetId]]
		}))
	}

	const remove = (targetId: string) => {
		setSchedulesMap((prev) => {
			const newMap = {...prev}
			delete newMap[targetId]
			return newMap
		})
	}

	return {duplicate, remove}
}
