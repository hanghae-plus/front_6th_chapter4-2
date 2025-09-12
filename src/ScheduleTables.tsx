import { Flex } from "@chakra-ui/react";
import SearchDialog from "./SearchDialog.tsx";
import { useState } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import ScheduleTableWrapper from "./components/ScheduleTableWrapper.tsx";
import { useAllTableIds } from "./store/scheduleStore.ts";

export const ScheduleTables = () => {
  const tableIds = useAllTableIds();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = tableIds.length === 1;

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <ScheduleDndProvider key={tableId} tableId={tableId}>
            <ScheduleTableWrapper
              index={index}
              tableId={tableId}
              disabledRemoveButton={disabledRemoveButton}
              setSearchInfo={setSearchInfo}
            />
          </ScheduleDndProvider>
        ))}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
};
