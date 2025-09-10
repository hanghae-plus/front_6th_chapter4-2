import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { CellSize, DAY_LABELS, 분 } from "./constants.ts";
import { Schedule } from "./types.ts";
import { fill2, parseHnM } from "./utils.ts";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentProps, memo } from "react";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string, time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string, time: number }) => void;
}

const TIMES = [
  ...Array(18)
    .fill(0)
    .map((v, k) => v + k * 30 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 30 * 분)}`),

  ...Array(6)
    .fill(18 * 30 * 분)
    .map((v, k) => v + k * 55 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 50 * 분)}`),
] as const;

const ScheduleTableGrid = memo(({ onScheduleTimeClick }: { onScheduleTimeClick?: (timeInfo: { day: string, time: number }) => void }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`,
        gridTemplateRows: `40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`,
        backgroundColor: 'white',
        fontSize: '14px',
        textAlign: 'center',
        outline: '1px solid #d0d5dd',
      }}
    >
      <div 
        key="교시"
        style={{
          borderColor: '#e2e8f0',
          backgroundColor: '#f7fafc',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%'
        }}
      >
        <span style={{ fontWeight: 'bold' }}>교시</span>
      </div>
      {DAY_LABELS.map((day) => (
        <div 
          key={day}
          style={{
            borderLeft: '1px solid #e2e8f0',
            backgroundColor: '#f7fafc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <span style={{ fontWeight: 'bold' }}>{day}</span>
        </div>
      ))}
      {TIMES.map((time, timeIndex) => [
        <div
          key={`시간-${timeIndex + 1}`}
          style={{
            borderTop: '1px solid #e2e8f0',
            backgroundColor: timeIndex > 17 ? '#edf2f7' : '#f7fafc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <span style={{ fontSize: '12px' }}>{fill2(timeIndex + 1)} ({time})</span>
        </div>,
        ...DAY_LABELS.map((day) => (
          <div
            key={`${day}-${timeIndex + 2}`}
            style={{
              borderWidth: '1px 0 0 1px',
              borderStyle: 'solid',
              borderColor: '#e2e8f0',
              backgroundColor: timeIndex > 17 ? '#f7fafc' : 'white',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fffff0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = timeIndex > 17 ? '#f7fafc' : 'white'}
            onClick={() => onScheduleTimeClick?.({ day, time: timeIndex + 1 })}
          />
        ))
      ]).flat()}
    </div>
  );
})

const ScheduleTable = memo(({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
  const getColor = (lectureId: string): string => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    return colors[lectures.indexOf(lectureId) % colors.length];
  };

  const dndContext = useDndContext();

  const getActiveTableId = () => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  }

  const activeTableId = getActiveTableId();

  return (
    <Box
      position="relative"
      outline={activeTableId === tableId ? "5px dashed" : undefined}
      outlineColor="blue.300"
    >
      <ScheduleTableGrid onScheduleTimeClick={onScheduleTimeClick}/>
      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedule.lecture.id)}
          onDeleteButtonClick={() => onDeleteButtonClick?.({
            day: schedule.day,
            time: schedule.range[0],
          })}
        />
      ))}
    </Box>
  );
});

const DraggableSchedule = memo(({
 id,
 data,
 bg,
 onDeleteButtonClick
}: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
  onDeleteButtonClick: () => void
}) => {
  const { day, range, room, lecture } = data;
  const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });
  const leftIndex = DAY_LABELS.indexOf(day as typeof DAY_LABELS[number]);
  const topIndex = range[0] - 1;
  const size = range.length;

  return (
    <Popover>
      <PopoverTrigger>
        <Box
          position="absolute"
          left={`${120 + (CellSize.WIDTH * leftIndex) + 1}px`}
          top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
          width={(CellSize.WIDTH - 1) + "px"}
          height={(CellSize.HEIGHT * size - 1) + "px"}
          bg={bg}
          p={1}
          boxSizing="border-box"
          cursor="pointer"
          ref={setNodeRef}
          transform={CSS.Translate.toString(transform)}
          {...listeners}
          {...attributes}
        >
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{lecture.title}</span>
          <span style={{ fontSize: '12px' }}>{room}</span>
        </Box>
      </PopoverTrigger>
      <PopoverContent onClick={event => event.stopPropagation()}>
        <PopoverArrow/>
        <PopoverCloseButton/>
        <PopoverBody>
          <span>강의를 삭제하시겠습니까?</span>
          <Button colorScheme="red" size="xs" onClick={onDeleteButtonClick}>
            삭제
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}, (prevProps, nextProps) => {
  const prevData = prevProps.data;
  const nextData = nextProps.data;

  const prevLeftIndex = DAY_LABELS.indexOf(prevData.day as typeof DAY_LABELS[number]);
  const nextLeftIndex = DAY_LABELS.indexOf(nextData.day as typeof DAY_LABELS[number]);
  const prevTopIndex = prevData.range[0] - 1;
  const nextTopIndex = nextData.range[0] - 1;
  
  return prevData.lecture.title === nextData.lecture.title &&
    prevLeftIndex === nextLeftIndex &&
    prevTopIndex === nextTopIndex;
});

export default ScheduleTable;
