import { Flex } from "@chakra-ui/react";

import { useScheduleValue } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState } from "react";
import useCustomDnd from "./hooks/useCustomDnd.tsx";
import { ScheduleTableContainer } from "./ScheduleTableContainer.tsx";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";

export const ScheduleTables = () => {
  const schedulesMap = useScheduleValue();

  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);
  const { activeId } = useCustomDnd();
  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.keys(schedulesMap).map((tableId, index) => (
          // 드래그 앤 드롭이 다른 테이블에 영향을 주지 않도록 각 테이블마다 DndProvider를 생성
          <ScheduleDndProvider key={tableId}>
            <ScheduleTableContainer
              key={tableId}
              index={index}
              tableId={tableId}
              setSearchInfo={setSearchInfo}
              disabledRemoveButton={disabledRemoveButton}
              isActive={activeId === tableId}
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
