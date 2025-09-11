import { create } from "zustand";

export interface SearchOptions {
  query?: string;
  credits?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
}

interface SearchOptionsStore {
  searchOptions: SearchOptions;
  setQuery: (query: string) => void;
  setCredits: (credits?: string) => void;
  setGrades: (grades: number[]) => void;
  setDays: (days: string[]) => void;
  setTimes: (times: number[]) => void;
  setMajors: (majors: string[]) => void;
  reset: () => void;
}

const initialState: SearchOptions = {
  query: "",
  credits: undefined,
  grades: [],
  days: [],
  times: [],
  majors: [],
};

export const useSearchOptionsStore = create<SearchOptionsStore>((set) => ({
  searchOptions: initialState,
  setQuery: (query) =>
    set((state) => ({
      searchOptions: { ...state.searchOptions, query },
    })),
  setCredits: (credits) =>
    set((state) => ({
      searchOptions: { ...state.searchOptions, credits },
    })),
  setGrades: (grades) =>
    set((state) => ({
      searchOptions: { ...state.searchOptions, grades },
    })),
  setDays: (days) =>
    set((state) => ({
      searchOptions: { ...state.searchOptions, days },
    })),
  setTimes: (times) =>
    set((state) => ({
      searchOptions: { ...state.searchOptions, times },
    })),
  setMajors: (majors) =>
    set((state) => ({
      searchOptions: { ...state.searchOptions, majors },
    })),
  reset: () => set({ searchOptions: initialState }),
}));
