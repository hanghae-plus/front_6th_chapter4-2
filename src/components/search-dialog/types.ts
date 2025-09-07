export interface SearchOptions {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

export interface SearchInfo {
  tableId: string;
  day?: string;
  time?: number;
}
