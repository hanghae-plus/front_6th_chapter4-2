import { memo, useMemo } from "react";
import { Tag, TagCloseButton, TagLabel, Wrap } from "@chakra-ui/react";

interface SelectedTimeTagsProps {
  times: number[];
  onRemove: (time: number) => void;
}

// 선택된 시간 태그 컴포넌트
const SelectedTimeTags = ({ times, onRemove }: SelectedTimeTagsProps) => {
  const sortedTimes = useMemo(() => [...times].sort((a, b) => a - b), [times]);

  return (
    <Wrap spacing={1} mb={2}>
      {sortedTimes.map((time: number) => (
        <Tag key={time} size="sm" variant="outline" colorScheme="blue">
          <TagLabel>{time}교시</TagLabel>
          <TagCloseButton onClick={() => onRemove(time)} />
        </Tag>
      ))}
    </Wrap>
  );
};

SelectedTimeTags.displayName = "SelectedTimeTags";

export default memo(SelectedTimeTags);
