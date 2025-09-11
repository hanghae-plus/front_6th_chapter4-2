import { memo } from "react";
import { Checkbox } from "@chakra-ui/react";
import { DAY_LABELS } from "../../constants.ts";

// 요일 선택 컴포넌트 분리
const DayCheckboxes = () => {
  return (
    <>
      {DAY_LABELS.map((day) => (
        <Checkbox key={day} value={day}>
          {day}
        </Checkbox>
      ))}
    </>
  );
};

DayCheckboxes.displayName = "DayCheckboxes";

export default memo(DayCheckboxes);
