import axios from 'axios'
import {Lecture} from '../types.ts'

export const fetchMajors = () => axios.get<Lecture[]>(`${import.meta.env.BASE_URL}schedules-majors.json`)

export const fetchLiberalArts = () => axios.get<Lecture[]>(`${import.meta.env.BASE_URL}schedules-liberal-arts.json`)

export const fetchAllLectures = (() => {
	let cache: Promise<Lecture[]> | null = null

	return async () => {
		if (cache) {
			return cache
		}
		cache = Promise.all([fetchMajors(), fetchLiberalArts()]).then((results) => {
			console.log('API 호출 완료', performance.now())
			return results.flatMap((result) => result.data)
		})

		return cache
	}
})()
