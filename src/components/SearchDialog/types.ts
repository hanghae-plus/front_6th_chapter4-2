export interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

export interface SearchDialogProps {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

export interface FilterChangeHandler {
  (field: keyof SearchOption, value: SearchOption[keyof SearchOption]): void;
}

export interface LectureTableProps {
  visibleLectures: import("../../types").Lecture[];
  onAddSchedule: (lecture: import("../../types").Lecture) => void;
}

export interface LectureRowProps {
  lecture: import("../../types").Lecture;
  index: number;
  onAddSchedule: (lecture: import("../../types").Lecture) => void;
}
