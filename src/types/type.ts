// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

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

export interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

export interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}
