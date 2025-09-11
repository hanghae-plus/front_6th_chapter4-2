import { Flex } from "@chakra-ui/react";

import SearchDialog from "./SearchDialog.tsx";
import { useState } from "react";
import useCustomDnd from "./hooks/useCustomDnd.tsx";
import { ScheduleTableContainer } from "./ScheduleTableContainer.tsx";
import { useSchedulesMap } from "./store/useSchedules.ts";

export const ScheduleTables = () => {
  const schedulesMap = useSchedulesMap();
  const { activeId } = useCustomDnd();

  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.keys(schedulesMap).map((tableId, index) => (
          <ScheduleTableContainer
            key={tableId}
            index={index}
            tableId={tableId}
            setSearchInfo={setSearchInfo}
            disabledRemoveButton={disabledRemoveButton}
            isActive={activeId === tableId}
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
