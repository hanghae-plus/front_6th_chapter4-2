import { useState } from "react"
import { Schedule } from "../types/type"
import { DAY_LABELS } from "../constants";

export const useSchedule = (init: Schedule[]) => {
    const [schedules, setSchedules] = useState(init);
	const [isDrag, setIsDrag] = useState(false);

	const handleDragStart = () => setIsDrag(prev => !prev)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleDragEnd = (event: any) => {
		const { active, delta } = event;

		const { x, y } = delta;
		const [, index] = active.id.split(':');
		const schedule = schedules[index];
		const nowDayIndex = DAY_LABELS.indexOf(schedule.day as (typeof DAY_LABELS)[number]);
		const moveDayIndex = Math.floor(x / 80);
		const moveTimeIndex = Math.floor(y / 30);

		setIsDrag(false);

		setSchedules((prev) =>
			prev.map((schedule, idx) =>
				idx === Number(index)
					? {
							...schedule,
							day: DAY_LABELS[nowDayIndex + moveDayIndex],
							range: schedule.range.map((time) => time + moveTimeIndex),
					  }
					: { ...schedule }
			)
		);
	};

    return {
        schedules,
		isDrag,
		handleDragStart,
        handleDragEnd
    }
}