import { Flex } from "@chakra-ui/react";
import { useScheduleContext } from "../../provider/ScheduleContext.tsx";
import SearchDialog from "../search/SearchDialog.tsx";
import { useCallback, useState } from "react";
import ScheduleTableWrapper from "./ScheduleTableWrapper.tsx";

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const duplicate = useCallback((targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]]
    }));
  }, [setSchedulesMap]);

  const remove = useCallback((targetId: string) => {
      setSchedulesMap(prev => {
          const { [targetId]: _, ...rest } = prev;
          return rest;
      });
      }, [setSchedulesMap]);

  const onOpenSearch = useCallback((tableId: string, extra?: { day?: string; time?: number }) => {
      setSearchInfo({ tableId, ...extra });
  }, []);

  const onDeleteBlock = useCallback((tableId: string, day: string, time: number) => {
      setSchedulesMap(prev => ({
          ...prev,
          [tableId]: prev[tableId].filter(schedule => schedule.day !== day || !schedule.range.includes(time))
      }));
  }, [setSchedulesMap]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleTableWrapper key={tableId} tableId={tableId} index={index} schedules={schedules} disabledRemoveButton={disabledRemoveButton} onOpenSearch={onOpenSearch} onDuplicate={duplicate} onRemove={remove} onDeleteBlock={onDeleteBlock} />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)}/>
    </>
  );
}
