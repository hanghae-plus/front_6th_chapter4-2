import axios from 'axios';
import { Lecture } from '../types';

export const fetchMajors = () => axios.get<Lecture[]>('/schedules-majors.json'); // 전공 불러오기
export const fetchLiberalArts = () => axios.get<Lecture[]>('/schedules-liberal-arts.json'); // 교양 불러오기
