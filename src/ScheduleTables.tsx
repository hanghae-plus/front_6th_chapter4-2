import { Flex } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useScheduleState } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import ScheduleWrapper from "./ScheduleWrapper.tsx";

export type SearchInfo = {
  tableId: string;
  day?: string;
  time?: number;
} | null;

export const ScheduleTables = () => {
  const { schedulesMap } = useScheduleState();
  const [searchInfo, setSearchInfo] = useState<SearchInfo>(null);

  const tableEntries = useMemo(
    () => Object.entries(schedulesMap),
    [schedulesMap]
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableEntries.map(([tableId, schedules], index) => (
          <ScheduleWrapper
            key={tableId}
            tableId={tableId}
            schedules={schedules}
            index={index}
            setSearchInfo={setSearchInfo}
          />
        ))}
      </Flex>
      {searchInfo && (
        <SearchDialog
          isOpen={Boolean(searchInfo)}
          tableId={searchInfo?.tableId || null}
          initialDay={searchInfo?.day}
          initialTime={searchInfo?.time}
          onClose={() => setSearchInfo(null)} //TODO: 핸들러로 유즈콜백 묶어?
        />
      )}
    </>
  );
};
