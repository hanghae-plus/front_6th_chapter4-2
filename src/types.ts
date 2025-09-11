/**
 * 강의 정보를 나타내는 타입 정의
 */
export interface Lecture {
  id: string;
  title: string;
  credits: string;
  major: string;
  schedule: string;
  grade: number;
}

/**
 * 시간표에 표시되는 스케줄 정보를 나타내는 타입 정의
 */
export interface Schedule {
  lecture: Lecture;
  day: string;
  range: number[];
  room?: string;
}
