import { Flex } from "@chakra-ui/react";

import { useScheduleValue } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState } from "react";
import useCustomDnd from "./hooks/useCustomDnd.tsx";
import { ScheduleTableContainer } from "./ScheduleTableContainer.tsx";

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
          <ScheduleTableContainer
            key={tableId}
            index={index}
            tableId={tableId}
            setSearchInfo={setSearchInfo}
            disabledRemoveButton={disabledRemoveButton}
            isActive={activeId === tableId}
          />
          // <Stack key={tableId} width="600px">
          //   <Flex justifyContent="space-between" alignItems="center">
          //     <Heading as="h3" fontSize="lg">
          //       시간표 {index + 1}
          //     </Heading>
          //     <ButtonGroup size="sm" isAttached>
          //       <Button
          //         colorScheme="green"
          //         onClick={() => setSearchInfo({ tableId })}
          //       >
          //         시간표 추가
          //       </Button>
          //       <Button
          //         colorScheme="green"
          //         mx="1px"
          //         onClick={() => duplicate(tableId)}
          //       >
          //         복제
          //       </Button>
          //       <Button
          //         colorScheme="green"
          //         isDisabled={disabledRemoveButton}
          //         onClick={() => remove(tableId)}
          //       >
          //         삭제
          //       </Button>
          //     </ButtonGroup>
          //   </Flex>
          //   <ScheduleTable
          //     key={`schedule-table-${index}`}
          //     schedules={schedules}
          //     tableId={tableId}
          //     active={activeId === tableId}
          //     onScheduleTimeClick={(timeInfo) =>
          //       setSearchInfo({ tableId, ...timeInfo })
          //     }
          //     onDeleteButtonClick={({ day, time }) =>
          //       handleDelete(tableId, day, time)
          //     }
          //   />
          // </Stack>
        ))}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
};
