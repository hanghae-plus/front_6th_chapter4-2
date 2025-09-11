import { useState, useMemo } from 'react';
import { Lecture } from '../types';

export function useLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  const allMajors = useMemo(
    () => [...new Set(lectures.map((lecture) => lecture.major))],
    [lectures]
  );

  return { lectures, setLectures, allMajors };
}
