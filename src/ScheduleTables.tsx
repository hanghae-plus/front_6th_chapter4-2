import { Flex } from "@chakra-ui/react";
import SearchDialog from "./SearchDialog.tsx";
import { useState } from "react";
import { ScheduleTableWrapper } from "./ScheduleTableWrapper.tsx";
import { useSchedulesStore } from "./store/schedulesStore.ts";

export const ScheduleTables = () => {
  const schedulesMap = useSchedulesStore((state) => state.schedulesMap);
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleTableWrapper
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
};
