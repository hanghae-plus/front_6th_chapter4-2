import { Text } from "@chakra-ui/react";
import { memo } from "react";
import { Lecture } from "../../types";

const ScheduleItem = ({
  lecture,
  room,
}: {
  lecture: Lecture;
  room?: string;
}) => {
  return (
    <>
      <Text fontSize="sm" fontWeight="bold">
        {lecture.title}
      </Text>
      <Text fontSize="xs">{room}</Text>
    </>
  );
};

ScheduleItem.displayName = "ScheduleItem";

export default memo(ScheduleItem);
