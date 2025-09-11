import { memo } from "react";
import { Checkbox } from "@chakra-ui/react";

// 학년 선택 컴포넌트 분리
const GradeCheckboxes = () => {
  return (
    <>
      {[1, 2, 3, 4].map((grade) => (
        <Checkbox key={grade} value={grade}>
          {grade}학년
        </Checkbox>
      ))}
    </>
  );
};

GradeCheckboxes.displayName = "GradeCheckboxes";

export default memo(GradeCheckboxes);
