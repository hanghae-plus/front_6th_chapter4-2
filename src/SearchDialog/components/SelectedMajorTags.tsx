import { memo } from "react";
import { Tag, TagCloseButton, TagLabel, Wrap } from "@chakra-ui/react";

interface SelectedMajorTagsProps {
  majors: string[];
  onRemove: (major: string) => void;
}

// 선택된 전공 태그 컴포넌트
const SelectedMajorTags = ({ majors, onRemove }: SelectedMajorTagsProps) => {
  return (
    <Wrap spacing={1} mb={2}>
      {majors.map((major: string) => (
        <Tag key={major} size="sm" variant="outline" colorScheme="blue">
          <TagLabel>{major.split("<p>").pop()}</TagLabel>
          <TagCloseButton onClick={() => onRemove(major)} />
        </Tag>
      ))}
    </Wrap>
  );
};

SelectedMajorTags.displayName = "SelectedMajorTags";

export default memo(SelectedMajorTags);
