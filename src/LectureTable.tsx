import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Lecture } from "./types";
import { Box, Button, Table, Tbody, Td, Tr } from "@chakra-ui/react";

interface LectureLowProps {
  index: number;
  lecture: Lecture;
  addSchedule: (lecture: Lecture) => void;
}
interface LectureTableProps {
  lectures: Lecture[];
  addSchedule: (lecture: Lecture) => void;
}
const PAGE_SIZE = 100;

const LectureLow = memo(({ index, lecture, addSchedule }: LectureLowProps) => (
  <Tr key={`${lecture.id}-${index}`}>
    <Td width="100px">{lecture.id}</Td>
    <Td width="50px">{lecture.grade}</Td>
    <Td width="200px">{lecture.title}</Td>
    <Td width="50px">{lecture.credits}</Td>
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
    <Td width="80px">
      <Button size="sm" colorScheme="green" onClick={() => addSchedule(lecture)}>
        추가
      </Button>
    </Td>
  </Tr>
));

const LectureTable = ({ lectures, addSchedule }: LectureTableProps) => {
  const [page, setPage] = useState(1);
  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const lastPage = Math.ceil(lectures.length / PAGE_SIZE);
  const visibleLectures = useMemo(() => lectures.slice(0, page * PAGE_SIZE), [lectures, page]);
  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => Math.min(lastPage, prevPage + 1));
        }
      },
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  useEffect(() => {
    setPage(1);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, [lectures]);
  return (
    <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
      <Table size="sm" variant="striped">
        <Tbody>
          {visibleLectures.map((lecture, index) => (
            <LectureLow index={index} lecture={lecture} addSchedule={addSchedule} />
          ))}
        </Tbody>
      </Table>
      <Box ref={loaderRef} h="20px" />
    </Box>
  );
};

export default LectureTable;
