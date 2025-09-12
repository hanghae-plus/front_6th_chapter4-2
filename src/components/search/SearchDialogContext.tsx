import { createContext } from "react";
import { SearchOption, Lecture } from "../../types";

export const SearchDialogContext = createContext<{
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[keyof SearchOption]
  ) => void;
  addSchedule: (lecture: Lecture) => void;
} | null>(null);
