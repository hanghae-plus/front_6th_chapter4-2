import { createSelector } from "reselect";
import { ScheduleState } from "./scheduleStore";

const selectSchedulesMap = (state: ScheduleState) => state.schedulesMap;

export const selectTableIds = createSelector([selectSchedulesMap], (schedulesMap) => {
  return Object.keys(schedulesMap);
});
