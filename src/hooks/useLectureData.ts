import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { Lecture } from "../types";

const createCachedFetcher = (
  fetchFn: () => Promise<AxiosResponse<Lecture[]>>,
  cacheKey: string,
) => {
  let cache: Promise<AxiosResponse<Lecture[]>> | null = null;

  return () => {
    if (cache) {
      console.log(`${cacheKey} 캐시에서 반환!`);
      return cache;
    }
    console.log(`${cacheKey} 새로 API 호출`);
    cache = fetchFn();
    return cache;
  };
};

const fetchMajors = () => axios.get<Lecture[]>("/schedules-majors.json");
const fetchLiberalArts = () =>
  axios.get<Lecture[]>("/schedules-liberal-arts.json");

const fetchMajorsWithCache = createCachedFetcher(fetchMajors, "majors");
const fetchLiberalArtsWithCache = createCachedFetcher(
  fetchLiberalArts,
  "liberalArts",
);

const fetchAllLectures = () => {
  console.log("API Call 1", performance.now());
  console.log("API Call 2", performance.now());
  return Promise.all([fetchMajorsWithCache(), fetchLiberalArtsWithCache()]);
};

export const useLectureData = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const start = performance.now();
    console.log("API 호출 시작: ", start);

    fetchAllLectures().then((results) => {
      const end = performance.now();
      console.log("모든 API 호출 완료 ", end);
      console.log("API 호출에 걸린 시간(ms): ", end - start);
      setLectures(results.flatMap((result) => result.data));
      setIsLoading(false);
    });
  }, []);

  return { lectures, isLoading };
};
