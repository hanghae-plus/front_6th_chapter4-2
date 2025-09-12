import { memo, useCallback } from "react";
import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

interface Props {
  time: number;
  onRemove: (time: number) => void;
}

const TimeTag = memo(({ time, onRemove }: Props) => {
  const handleRemove = useCallback(() => {
    onRemove(time);
  }, [onRemove, time]);

  return (
    <Tag size="sm" variant="outline" colorScheme="blue">
      <TagLabel>{time}교시</TagLabel>
      <TagCloseButton onClick={handleRemove} />
    </Tag>
  );
});

export default TimeTag;
