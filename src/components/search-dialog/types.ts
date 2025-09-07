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

export type SearchOptionProps<K extends keyof SearchOptions> = {
  value: SearchOptions[K];
  onChange: (newValue: SearchOptions[K]) => void;
};
