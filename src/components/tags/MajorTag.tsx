import { memo, useCallback, useMemo } from "react";
import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

interface Props {
  major: string;
  onRemove: (major: string) => void;
}

const MajorTag = memo(({ major, onRemove }: Props) => {
  const handleRemove = useCallback(() => {
    onRemove(major);
  }, [onRemove, major]);

  const displayText = useMemo(() => major.split("<p>").pop(), [major]);

  return (
    <Tag size="sm" variant="outline" colorScheme="blue">
      <TagLabel>{displayText}</TagLabel>
      <TagCloseButton onClick={handleRemove} />
    </Tag>
  );
});

export default MajorTag;
