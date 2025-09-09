import axios from "axios";
import { Lecture } from "../types";

let lecturesPromise: Promise<Lecture[]> | null = null;

const fetchMajors = () => axios.get<Lecture[]>("/schedules-majors.json");
const fetchLiberalArts = () => axios.get<Lecture[]>("/schedules-liberal-arts.json");

export const fetchAllLectures = async (): Promise<Lecture[]> => {
  if (lecturesPromise) {
    return lecturesPromise;
  }

  lecturesPromise = Promise.all([fetchMajors(), fetchLiberalArts()]).then(
    ([majorsResponse, liberalArtsResponse]) => {
      const combinedLectures = [...majorsResponse.data, ...liberalArtsResponse.data];
      return combinedLectures;
    }
  );

  return lecturesPromise;
};
