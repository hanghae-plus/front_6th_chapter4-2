import { useEffect, useMemo, useState } from "react";
import { parseSchedule } from "../lib/utils";
import { Lecture, ProcessedLecture } from "../types";
import { fetchAllLectures } from "../lib/api";

export const useLectureData = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [processedLectures, setProcessedLectures] = useState<ProcessedLecture[]>([]);

  useEffect(() => {
    fetchAllLectures().then((results) => {
      setLectures(results.flatMap((result) => result.data));
    });
  }, []);

  useEffect(() => {
    if (lectures && lectures.length > 0) {
      const parsedData = lectures.map((lecture) => ({
        ...lecture,
        parsedSchedule: lecture.schedule ? parseSchedule(lecture.schedule) : [],
      }));
      setProcessedLectures(parsedData);
    }
  }, [lectures]);

  const allMajors = useMemo(() => {
    return [...new Set(lectures.map((lecture) => lecture.major))];
  }, [lectures]);

  return { processedLectures, allMajors };
};
