import axios, { AxiosResponse } from "axios";
import { Lecture } from "../../types.ts";

// 전공 과목 데이터 가져오기
export const fetchMajors = () => axios.get<Lecture[]>("/schedules-majors.json");

// 교양 과목 데이터 가져오기
export const fetchLiberalArts = () =>
  axios.get<Lecture[]>("/schedules-liberal-arts.json");

// 모든 강의 데이터를 가져오는 함수 (성능 테스트를 위한 중복 호출 포함)
export const fetchAllLectures = async () => {
  let major: AxiosResponse<Lecture[]> | null = null;
  let liberalArts: AxiosResponse<Lecture[]> | null = null;

  const gethMajors = await fetchMajors();
  const getLiberalArts = await fetchLiberalArts();

  major = major ?? gethMajors;
  liberalArts = liberalArts ?? getLiberalArts;

  return Promise.all([
    (console.log("API Call 1", performance.now()), major),
    (console.log("API Call 2", performance.now()), liberalArts),
    (console.log("API Call 3", performance.now()), major),
    (console.log("API Call 4", performance.now()), liberalArts),
    (console.log("API Call 5", performance.now()), major),
    (console.log("API Call 6", performance.now()), liberalArts),
  ]);
};
