import type { AxiosResponse } from "axios";
import axios from "axios";

import type { Lecture } from "../types";

const http = axios.create({
  baseURL: import.meta.env.BASE_URL,
});

export class LectureService {
  private static instance: LectureService;

  private majorsCache: Promise<AxiosResponse<Lecture[]>> | null = null;
  private liberalArtsCache: Promise<AxiosResponse<Lecture[]>> | null = null;

  private constructor() {}

  public static getInstance() {
    if (!LectureService.instance) {
      LectureService.instance = new LectureService();
    }

    return LectureService.instance;
  }

  public async getMajorLectures() {
    if (!this.majorsCache) {
      this.majorsCache = this.fetchMajorLectures();
    }

    return this.majorsCache;
  }

  public async getLiberalArtsLectures() {
    if (!this.liberalArtsCache) {
      this.liberalArtsCache = this.fetchLiberalArtsLectures();
    }

    return this.liberalArtsCache;
  }

  public async getAllLectures() {
    const startTime = performance.now();
    console.log("API 호출 시작: ", startTime);

    const results = await Promise.all([
      (console.log("API Call 1", performance.now()), this.getMajorLectures()),
      (console.log("API Call 2", performance.now()), this.getLiberalArtsLectures()),
      (console.log("API Call 3", performance.now()), this.getMajorLectures()),
      (console.log("API Call 4", performance.now()), this.getLiberalArtsLectures()),
      (console.log("API Call 5", performance.now()), this.getMajorLectures()),
      (console.log("API Call 6", performance.now()), this.getLiberalArtsLectures()),
    ]);

    const endTime = performance.now();
    console.log("모든 API 호출 완료: ", endTime);
    console.log("API 호출에 걸린 시간(ms): ", endTime - startTime);

    return results.flatMap((result) => result.data);
  }

  public clearCache() {
    this.majorsCache = null;
    this.liberalArtsCache = null;
  }

  private fetchMajorLectures() {
    return http.get<Lecture[]>("/schedules-majors.json");
  }

  private fetchLiberalArtsLectures() {
    return http.get<Lecture[]>("/schedules-liberal-arts.json");
  }
}
