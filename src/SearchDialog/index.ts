// SearchDialog 모듈의 진입점
export { default as SearchDialog } from "./SearchDialog.tsx";
export type { SearchInfo, SearchOption, SearchDialogProps } from "./types.ts";
export {
  fetchAllLectures,
  fetchMajors,
  fetchLiberalArts,
} from "./services/lectureApi.ts";
export { TIME_SLOTS, PAGE_SIZE } from "./services/timeSlots.ts";

// 커스텀 훅들
export { useLectureData } from "./hooks/useLectureData.ts";
export { useSearchLogic } from "./hooks/useSearchLogic.ts"; // DEPRECATED (useReducer + useMemo)
export { useInfiniteScroll } from "./hooks/useInfiniteScroll.ts";
export { useScheduleManager } from "./hooks/useScheduleManager.ts"; // DEPRECATED (useCallback)

// 컴포넌트들
export { default as SearchFilters } from "./components/SearchFilters.tsx";
export { default as SearchItem } from "./components/SearchItem.tsx";
export { default as SearchResultTable } from "./components/SearchResultTable.tsx";
