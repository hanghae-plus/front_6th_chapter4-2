import axios from "axios";
import { Lecture } from "../types";
import { BASE_URL } from "../constants";

export const fetchMajors = () => axios.get<Lecture[]>(`${BASE_URL}/schedules-majors.json`);
export const fetchLiberalArts = () =>
  axios.get<Lecture[]>(`${BASE_URL}/schedules-liberal-arts.json`);

const apiCache = new Map<string, Promise<any>>();

const fetchWithCache = (key: string, fetcher: () => Promise<any>) => {
  if (!apiCache.has(key)) {
    console.log(`${key} API CALL`);
    apiCache.set(
      key,
      fetcher().catch((error) => {
        apiCache.delete(key);
        throw error;
      })
    );
  }
  return apiCache.get(key);
};

export const fetchAllLectures = () => {
  const majorsUrl = `${BASE_URL}/schedules-majors.json`;
  const liberalArtsUrl = `${BASE_URL}/schedules-liberal-arts.json`;

  return Promise.all([
    fetchWithCache(majorsUrl, fetchMajors),
    fetchWithCache(liberalArtsUrl, fetchLiberalArts),
    fetchWithCache(majorsUrl, fetchMajors),
    fetchWithCache(liberalArtsUrl, fetchLiberalArts),
    fetchWithCache(majorsUrl, fetchMajors),
    fetchWithCache(liberalArtsUrl, fetchLiberalArts),
  ]);
};
