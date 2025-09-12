import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import { useScheduleContext } from "../../contexts";
import type { SearchInfo } from "../../types";
import { SearchDialog } from "../search-dialog";
import { MemoizedScheduleTableWrapper } from "./__private__";

export function ScheduleTables() {
  const { schedulesMap } = useScheduleContext();

  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <MemoizedScheduleTableWrapper
            key={tableId}
            tableId={tableId}
            schedules={schedules}
            index={index}
            setSearchInfo={setSearchInfo}
          />
        ))}
      </Flex>

      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
    </>
  );
}
