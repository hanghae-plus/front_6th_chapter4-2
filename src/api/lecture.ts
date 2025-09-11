import axios from 'axios';
import { Lecture } from '../types';

const BASE_URL = process.env.NODE_ENV === 'production' ? '/front_6th_chapter4-2' : '';

export const fetchMajors = () => axios.get<Lecture[]>(`${BASE_URL}/schedules-majors.json`); // 전공 불러오기
export const fetchLiberalArts = () => axios.get<Lecture[]>(`${BASE_URL}/schedules-liberal-arts.json`); // 교양 불러오기
