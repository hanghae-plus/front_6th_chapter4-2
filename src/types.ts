export interface Lecture {
  id: string; // 과목코드
  title: string;
  credits: string;
  major: string; // 전공
  schedule: string; // 시간
  grade: number; // 학년
}

export interface Schedule {
  lecture: Lecture;
  day: string;
  range: number[];
  room?: string;
}

export interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}
