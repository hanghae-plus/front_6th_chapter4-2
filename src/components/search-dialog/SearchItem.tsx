import { memo } from "react";
import { Button} from "@chakra-ui/react";
import { Lecture } from "../../types";

interface SearchItemProps extends Lecture {
  addSchedule: (lecture: Lecture) => void;
}

const LectureCode = memo(({ id }: { id: string }) => (
  <td width="100px">{id}</td>
));
LectureCode.displayName = "LectureCode";

const LectureGrade = memo(({ grade }: { grade: number }) => (
  <td width="50px">{grade}</td>
));
LectureGrade.displayName = "LectureGrade";

const LectureTitle = memo(({ title }: { title: string }) => (
  <td width="200px">{title}</td>
));
LectureTitle.displayName = "LectureTitle";

const LectureCredits = memo(({ credits }: { credits: string }) => (
  <td width="50px">{credits}</td>
));
LectureCredits.displayName = "LectureCredits";

const LectureMajor = memo(({ major }: { major: string }) => (
  <td width="150px" dangerouslySetInnerHTML={{ __html: major }} />
));
LectureMajor.displayName = "LectureMajor";

const LectureSchedule = memo(({ schedule }: { schedule: string }) => (
  <td width="150px" dangerouslySetInnerHTML={{ __html: schedule }} />
));
LectureSchedule.displayName = "LectureSchedule";

const AddButton = memo(({ lecture, addSchedule }: { lecture: Lecture; addSchedule: (lecture: Lecture) => void }) => (
  <td width="80px">
    <Button
      size="sm"
      colorScheme="green"
      onClick={() => addSchedule(lecture)}
    >
      추가
    </Button>
  </td>
));
AddButton.displayName = "AddButton";

export const SearchItem = memo(
  ({ addSchedule, ...lecture }: SearchItemProps) => {
    const { id, grade, title, credits, major, schedule } = lecture;

    return (
      <tr>
        <LectureCode id={id} />
        <LectureGrade grade={grade} />
        <LectureTitle title={title} />
        <LectureCredits credits={credits} />
        <LectureMajor major={major} />
        <LectureSchedule schedule={schedule} />
        <AddButton lecture={lecture} addSchedule={addSchedule} />
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.grade === nextProps.grade &&
      prevProps.title === nextProps.title &&
      prevProps.credits === nextProps.credits &&
      prevProps.major === nextProps.major &&
      prevProps.schedule === nextProps.schedule &&
      prevProps.addSchedule === nextProps.addSchedule
    );
  },
);

SearchItem.displayName = "SearchItem";
