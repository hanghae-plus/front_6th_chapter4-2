export interface SearchOption {
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

export interface SearchDialogProps {
  searchInfo: SearchInfo | null;
  onClose: () => void;
}
