import { create } from "zustand";
import dummyScheduleMap from "../dummyScheduleMap.ts";
import type { Schedule } from "../types.ts";

interface Schedules {
	schedulesMap: Record<string, Schedule[]>;
	setSchedulesMap: (
		schedulesMap:
			| Record<string, Schedule[]>
			| ((prev: Record<string, Schedule[]>) => Record<string, Schedule[]>),
	) => void;
}

export const useSchedules = create<Schedules>((set, get) => ({
	schedulesMap: dummyScheduleMap,
	setSchedulesMap: (schedulesMap) =>
		set({
			schedulesMap:
				typeof schedulesMap === "function"
					? schedulesMap(get().schedulesMap)
					: schedulesMap,
		}),
}));
