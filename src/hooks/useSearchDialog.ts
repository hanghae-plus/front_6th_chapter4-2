import {useEffect, useMemo, useRef, useState} from 'react'
import {Lecture} from '../types.ts'
import {SearchOption, filterLectures, getAllMajors} from '../utils/lectureFilters.ts'
import {fetchAllLectures} from '../services/lectureService.ts'
import {parseSchedule} from '../utils.ts'
import {useAutoCallback} from './useAutoCallback.ts'
import {useScheduleStore} from '../store/scheduleStore.ts'

const PAGE_SIZE = 100

interface UseSearchDialogProps {
	searchInfo: {
		tableId: string
		day?: string
		time?: number
	} | null
	onClose: () => void
}

export const useSearchDialog = ({searchInfo, onClose}: UseSearchDialogProps) => {
	const addSchedulesToTable = useScheduleStore((state) => state.addSchedulesToTable)

	const loaderWrapperRef = useRef<HTMLDivElement>(null)
	const loaderRef = useRef<HTMLDivElement>(null)
	const [lectures, setLectures] = useState<Lecture[]>([])
	const [page, setPage] = useState(1)
	const [searchOptions, setSearchOptions] = useState<SearchOption>({
		query: '',
		grades: [],
		days: [],
		times: [],
		majors: []
	})

	const filteredLectures = useMemo(() => {
		return filterLectures(lectures, searchOptions)
	}, [lectures, searchOptions])

	const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE)

	const visibleLectures = useMemo(() => {
		return filteredLectures.slice(0, page * PAGE_SIZE)
	}, [filteredLectures, page])

	const allMajors = useMemo(() => {
		return getAllMajors(lectures)
	}, [lectures])

	const changeSearchOption = useAutoCallback((field: keyof SearchOption, value: SearchOption[typeof field]) => {
		setPage(1)
		setSearchOptions((prev) => ({...prev, [field]: value}))
		loaderWrapperRef.current?.scrollTo(0, 0)
	})

	const addSchedule = useAutoCallback((lecture: Lecture) => {
		if (!searchInfo) return

		const {tableId} = searchInfo

		const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
			...schedule,
			lecture
		}))

		// setSchedulesMap((prev) => ({
		// 	...prev,
		// 	[tableId]: [...prev[tableId], ...schedules]
		// }))

		addSchedulesToTable(tableId, schedules)
		onClose()
	})

	// 이벤트 핸들러들
	const handleQueryChange = useAutoCallback((e: React.ChangeEvent<HTMLInputElement>) => changeSearchOption('query', e.target.value))

	const handleCreditsChange = useAutoCallback((e: React.ChangeEvent<HTMLSelectElement>) => changeSearchOption('credits', e.target.value))

	const handleGradesChange = useAutoCallback((value: (string | number)[]) => changeSearchOption('grades', value.map(Number)))

	const handleDaysChange = useAutoCallback((value: (string | number)[]) => changeSearchOption('days', value as string[]))

	const handleTimesChange = useAutoCallback((values: (string | number)[]) => changeSearchOption('times', values.map(Number)))

	const handleMajorsChange = useAutoCallback((values: (string | number)[]) => changeSearchOption('majors', values as string[]))

	const handleTimeRemove = useAutoCallback((timeToRemove: number) => {
		setSearchOptions((prev) => ({
			...prev,
			times: prev.times.filter((v) => v !== timeToRemove)
		}))
		setPage(1)
		loaderWrapperRef.current?.scrollTo(0, 0)
	})

	const handleMajorRemove = useAutoCallback((majorToRemove: string) => {
		setSearchOptions((prev) => ({
			...prev,
			majors: prev.majors.filter((v) => v !== majorToRemove)
		}))
		setPage(1)
		loaderWrapperRef.current?.scrollTo(0, 0)
	})

	// Effects
	useEffect(() => {
		const start = performance.now()
		console.log('API 호출 시작: ', start)
		console.log('BASE_URL:', import.meta.env.BASE_URL)
		fetchAllLectures()
			.then((results) => {
				const end = performance.now()
				console.log('모든 API 호출 완료 ', end)
				console.log('API 호출에 걸린 시간(ms): ', end - start)
				console.log('받은 데이터 개수:', results.length)
				setLectures(results)
			})
			.catch((error) => {
				console.error('API 호출 에러:', error)
			})
	}, [])

	useEffect(() => {
		const $loader = loaderRef.current
		const $loaderWrapper = loaderWrapperRef.current

		if (!$loader || !$loaderWrapper) {
			return
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setPage((prevPage) => Math.min(lastPage, prevPage + 1))
				}
			},
			{threshold: 0, root: $loaderWrapper}
		)

		observer.observe($loader)

		return () => observer.unobserve($loader)
	}, [lastPage])

	useEffect(() => {
		setSearchOptions((prev) => ({
			...prev,
			days: searchInfo?.day ? [searchInfo.day] : [],
			times: searchInfo?.time ? [searchInfo.time] : []
		}))
		setPage(1)
	}, [searchInfo])

	return {
		searchOptions,
		filteredLectures,
		visibleLectures,
		allMajors,
		loaderWrapperRef,
		loaderRef,
		addSchedule,
		handleQueryChange,
		handleCreditsChange,
		handleGradesChange,
		handleDaysChange,
		handleTimesChange,
		handleMajorsChange,
		handleTimeRemove,
		handleMajorRemove
	}
}
