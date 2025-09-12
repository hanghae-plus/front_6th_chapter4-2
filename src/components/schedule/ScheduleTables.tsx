import { Flex } from "@chakra-ui/react";
import { useMemo, memo } from "react";
import { useSchedulesData } from "../../contexts";
import { useSearchInfo, useAutoCallback } from "../../hooks";
import { SearchDialog } from "../search/SearchDialog";
import { ScheduleWrapper } from "./ScheduleWrapper";

export const ScheduleTables = memo(() => {
  const { schedulesMap } = useSchedulesData();
  const { searchInfo, setSearchInfo } = useSearchInfo();

  const disabledRemoveButton = useMemo(
    () => Object.keys(schedulesMap).length === 1,
    [schedulesMap]
  );

  const handleCloseSearchDialog = useAutoCallback(() => {
    setSearchInfo(null);
  });

  const stableSetSearchInfo = useAutoCallback(setSearchInfo);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleWrapper
            key={tableId}
            tableId={tableId}
            schedules={schedules}
            index={index}
            setSearchInfo={stableSetSearchInfo}
            disabledRemoveButton={disabledRemoveButton}
          />
        ))}
      </Flex>

      {searchInfo && (
        <SearchDialog
          searchInfo={searchInfo}
          onClose={handleCloseSearchDialog}
        />
      )}
    </>
  );
});

ScheduleTables.displayName = "ScheduleTables";
