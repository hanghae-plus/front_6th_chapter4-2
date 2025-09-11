import { Box, Table, Tbody } from '@chakra-ui/react';
import { forwardRef, memo } from 'react';
import type { Lecture } from '../../types';
import { lectureTableComparison } from '../../utils/memoComparison';
import LectureRow from './LectureRow';

interface LectureTableProps {
  visibleLectures: Lecture[];
  onAddSchedule: (lecture: Lecture) => void;
}

const LectureTable = memo(
  forwardRef<HTMLDivElement, LectureTableProps>(
    ({ visibleLectures, onAddSchedule }, ref) => {
      return (
        <Box overflowY="auto" maxH="500px" ref={ref}>
          <Table size="sm" variant="striped">
            <Tbody>
              {visibleLectures.map((lecture, index) => (
                <LectureRow
                  key={`${lecture.id}-${index}`}
                  lecture={lecture}
                  index={index}
                  onAddSchedule={onAddSchedule}
                />
              ))}
            </Tbody>
          </Table>
        </Box>
      );
    },
  ),
  lectureTableComparison,
);

LectureTable.displayName = 'LectureTable';

export default LectureTable;
