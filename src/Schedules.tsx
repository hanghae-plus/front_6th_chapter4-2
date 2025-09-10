import DraggableSchedule from "./DraggableSchedule";
import { Schedule } from "./types/type";


const getColor = (schedules: Schedule[], lectureId: string): string => {
  const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
  const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
  return colors[lectures.indexOf(lectureId) % colors.length];
};

const Schedules = ({
  tableId,
  schedules,
  onDeleteButtonClick,
}: {
  tableId: string;
  schedules: Schedule[],
  onDeleteButtonClick: ((timeInfo: { day: string; time: number }) => void) | undefined;
}) => {
  return (
    <>
      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          tableId={tableId}
          day={schedule.day}
          range={schedule.range}
          room={schedule.room}
          lecture={schedule.lecture}
          bg={getColor(schedules, schedule.lecture.id)}
          onDeleteButtonClick={() =>
            onDeleteButtonClick?.({
              day: schedule.day,
              time: schedule.range[0],
            })
          }
        />
      ))}
    </>
  );
};

export default Schedules;
