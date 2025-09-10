import {Lecture} from '../types.ts'
import {parseSchedule} from '../utils.ts'

export interface SearchOption {
	query?: string
	grades: number[]
	days: string[]
	times: number[]
	majors: string[]
	credits?: number
}

export const filterLectures = (lectures: Lecture[], searchOptions: SearchOption): Lecture[] => {
	const {query = '', credits, grades, days, times, majors} = searchOptions
	const lowerQuery = query.toLowerCase()

	return lectures.filter((lecture) => {
		if (!lecture?.title || !lecture?.id) return false

		// 검색어 필터
		const lowerTitle = lecture.title.toLowerCase()
		if (query && !lowerTitle.includes(lowerQuery) && !lecture.id.toLowerCase().includes(lowerQuery)) {
			return false
		}

		// 학년, 전공, 학점 필터
		if (grades.length > 0 && !grades.includes(lecture.grade)) return false
		if (majors.length > 0 && !majors.includes(lecture.major)) return false
		if (credits && !lecture.credits.startsWith(String(credits))) return false

		const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : []

		if (days.length > 0 && !schedules.some((s) => days.includes(s.day))) return false
		if (times.length > 0 && !schedules.some((s) => s.range.some((time) => times.includes(time)))) return false

		return true
	})
}

export const getAllMajors = (lectures: Lecture[]): string[] => {
	return [...new Set(lectures.filter((lecture) => lecture && lecture.major).map((lecture) => lecture.major))]
}
