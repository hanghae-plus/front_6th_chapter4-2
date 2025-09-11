import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Lecture } from "../types.ts";
import fetchWithCache from "../utils/fetchWithCache.ts";

export const useLectureData = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const allMajors = useMemo(
    () => [...new Set(lectures.map((lecture) => lecture.major))],
    [lectures]
  );

  useEffect(() => {
    const start = performance.now();
    console.log("API 호출 시작: ", start);
    fetchAllLectures().then((results) => {
      const end = performance.now();
      console.log("모든 API 호출 완료 ", end);
      console.log("API 호출에 걸린 시간(ms): ", end - start);
      setLectures(results.flatMap((result) => result.data));
    });
  }, []);

  return {
    lectures,
    allMajors,
  };
};

const fetchMajors = () =>
  axios.get<Lecture[]>(`${import.meta.env.BASE_URL}schedules-majors.json`);
const fetchLiberalArts = () =>
  axios.get<Lecture[]>(
    `${import.meta.env.BASE_URL}schedules-liberal-arts.json`
  );

const fetchAllLectures = async () =>
  await Promise.all([
    fetchWithCache("MAJORS", fetchMajors),
    fetchWithCache("LIBERAL_ARTS", fetchLiberalArts),
    fetchWithCache("MAJORS", fetchMajors),
    fetchWithCache("LIBERAL_ARTS", fetchLiberalArts),
    fetchWithCache("MAJORS", fetchMajors),
    fetchWithCache("LIBERAL_ARTS", fetchLiberalArts),
  ]);
