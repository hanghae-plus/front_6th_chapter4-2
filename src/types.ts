export interface Lecture {
  id: string;
  title: string;
  credits: string;
  major: string;
  schedule: string;
  grade: number;
}

export interface Schedule {
  lecture: Lecture;
  day: string;
  range: number[];
  room?: string;
}

export interface TimeInfo {
  day: string;
  time: number;
}

export interface SearchInfo {
  tableId: string;
  day?: string;
  time?: number;
}
