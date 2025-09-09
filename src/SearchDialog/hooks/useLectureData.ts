import { useEffect, useState } from "react";
import { Lecture } from "../../types.ts";
import { fetchAllLectures } from "../services/lectureApi.ts";

/**
 * 강의 데이터를 관리하는 커스텀 훅
 * API 호출 및 전체 강의 목록 상태를 관리합니다.
 */
export const useLectureData = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLectures = async () => {
      setIsLoading(true);
      const start = performance.now();
      console.log("API 호출 시작: ", start);

      try {
        const results = await fetchAllLectures();
        const end = performance.now();
        console.log("모든 API 호출 완료 ", end);
        console.log("API 호출에 걸린 시간(ms): ", end - start);
        setLectures(results.flatMap((result) => result.data));
      } catch (error) {
        console.error("강의 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLectures();
  }, []);

  return {
    lectures,
    isLoading,
  };
};
