import { Flex } from "@chakra-ui/react";
import { memo, useMemo, useState } from "react";
import ScheduleContainer from "./ScheduleContainer.tsx";
import { useScheduleState } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";

export const ScheduleTables = memo(() => {
  const schedulesMap = useScheduleState();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = useMemo(
    () => Object.keys(schedulesMap).length === 1,
    [schedulesMap]
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleContainer
            key={tableId}
            index={index}
            tableId={tableId}
            schedules={schedules}
            disabledRemoveButton={disabledRemoveButton}
            setSearchInfo={setSearchInfo}
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
