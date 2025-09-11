import { Flex } from "@chakra-ui/react";
import { useMemo, memo } from "react";
import { useSchedulesData } from "../../contexts";
import { useSearchInfo } from "../../hooks";
import { SearchDialog } from "../search/SearchDialog";
import { ScheduleWrapper } from "./ScheduleWrapper";

export const ScheduleTables = memo(() => {
  const { schedulesMap } = useSchedulesData();
  const { searchInfo, setSearchInfo } = useSearchInfo();

  const disabledRemoveButton = useMemo(
    () => Object.keys(schedulesMap).length === 1,
    [schedulesMap]
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleWrapper
            key={tableId}
            tableId={tableId}
            schedules={schedules}
            index={index}
            setSearchInfo={setSearchInfo}
            disabledRemoveButton={disabledRemoveButton}
          />
        ))}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
});

ScheduleTables.displayName = "ScheduleTables";
