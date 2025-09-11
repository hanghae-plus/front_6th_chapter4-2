import { Button, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { Lecture } from "../../types";
import { memo } from "react";

export const SearchResultTable = memo(
  ({
    lectures,
    addSchedule,
  }: {
    lectures: Lecture[];
    addSchedule: (lecture: Lecture) => void;
  }) => {
    return (
      <Table size="sm" variant="striped">
        <Tbody>
          {lectures.map((lecture, index) => (
            <LectureRow
              key={`${lecture.id}-${index}`}
              lecture={lecture}
              index={index}
              addSchedule={addSchedule}
            />
          ))}
        </Tbody>
      </Table>
    );
  }
);

const LectureRow = memo(
  ({
    lecture,
    index,
    addSchedule,
  }: {
    lecture: Lecture;
    index: number;
    addSchedule: (lecture: Lecture) => void;
  }) => {
    return (
      <Tr key={`${lecture.id}-${index}`}>
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
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => addSchedule(lecture)}
          >
            추가
          </Button>
        </Td>
      </Tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.lecture.id === nextProps.lecture.id &&
      prevProps.index === nextProps.index
    );
  }
);
