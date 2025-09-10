import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Box, Table, Tbody, Tr, Td, Button } from "@chakra-ui/react";
import type { Lecture } from "./types.ts";

interface LectureTableProps {
  lectures: Lecture[];
  onAdd: (lecture: Lecture) => void;
}

const PAGE_SIZE = 100;

const LectureRow = memo(
  ({
    lecture,
    onAdd,
  }: {
    lecture: Lecture;
    onAdd: (lecture: Lecture) => void;
  }) => (
    <Tr>
      <Td width="100px">{lecture.id}</Td>
      <Td width="50px">{lecture.grade}</Td>
      <Td width="200px">{lecture.title}</Td>
      <Td width="50px">{lecture.credits}</Td>
      <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
      <Td
        width="150px"
        dangerouslySetInnerHTML={{ __html: lecture.schedule }}
      />
      <Td width="80px">
        <Button size="sm" colorScheme="green" onClick={() => onAdd(lecture)}>
          추가
        </Button>
      </Td>
    </Tr>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.lecture.id === nextProps.lecture.id &&
      prevProps.onAdd === nextProps.onAdd
    );
  }
);

const LectureTable = memo(
  ({ lectures, onAdd }: LectureTableProps) => {
    const loaderWrapperRef = useRef<HTMLDivElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);

    // 스케줄 파싱 캐시 (테이블에서는 현재 사용하지 않음, 필요시 추가)

    // 페이지네이션 계산
    const lastPage = Math.ceil(lectures.length / PAGE_SIZE);
    const visibleLectures = useMemo(
      () => lectures.slice(0, page * PAGE_SIZE),
      [lectures, page]
    );

    // 무한스크롤
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

    // lectures가 바뀌면 페이지 초기화
    useEffect(() => {
      setPage(1);
      loaderWrapperRef.current?.scrollTo(0, 0);
    }, [lectures]);

    return (
      <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
        <Table size="sm" variant="striped">
          <Tbody>
            {visibleLectures.map((lecture, index) => (
              <LectureRow
                key={`${lecture.id}-${lecture.major}-${lecture.schedule}-${index}`}
                lecture={lecture}
                onAdd={onAdd}
              />
            ))}
          </Tbody>
        </Table>
        <Box ref={loaderRef} h="20px" />
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.lectures === nextProps.lectures &&
      prevProps.onAdd === nextProps.onAdd
    );
  }
);

export default LectureTable;
