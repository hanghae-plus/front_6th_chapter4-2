import { memo } from "react";
import { Box, Checkbox } from "@chakra-ui/react";

interface MajorCheckboxesProps {
  allMajors: string[];
}

// 전공 선택 컴포넌트 분리
const MajorCheckboxes = ({ allMajors }: MajorCheckboxesProps) => {
  return (
    <>
      {allMajors.map((major) => (
        <Box key={major}>
          <Checkbox key={major} size="sm" value={major}>
            {major.replace(/<p>/gi, " ")}
          </Checkbox>
        </Box>
      ))}
    </>
  );
};

MajorCheckboxes.displayName = "MajorCheckboxes";

export default memo(MajorCheckboxes);
