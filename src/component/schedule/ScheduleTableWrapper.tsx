import {useScheduleContext} from "../../provider/ScheduleContext.tsx";
import {memo, useCallback} from "react";
import {Button, ButtonGroup, Flex, Heading, Stack} from "@chakra-ui/react";
import ScheduleDndProvider from "../../provider/ScheduleDndProvider.tsx";
import ScheduleTable from "./ScheduleTable.tsx";

type ScheduleTableWrapperProps = {
    tableId: string;
    index: number;
    schedules: ReturnType<typeof useScheduleContext>["schedulesMap"][string];
    disabledRemoveButton: boolean;
    onOpenSearch: (tableId: string, extra?: { day?: string; time?: number }) => void;
    onDuplicate: (tableId: string) => void;
    onRemove: (tableId: string) => void;
    onDeleteBlock: (tableId: string, day: string, time: number) => void;
};

const ScheduleTableWrapper = ({
                                                                    tableId,
                                                                    index,
                                                                    schedules,
                                                                    disabledRemoveButton,
                                                                    onOpenSearch,
                                                                    onDuplicate,
                                                                    onRemove,
                                                                    onDeleteBlock,
                                                                }: ScheduleTableWrapperProps ) => {
    const openSearch = useCallback(
        (extra?: { day?: string; time?: number }) => onOpenSearch(tableId, extra),
        [onOpenSearch, tableId]
    );

    const duplicate = useCallback(() => onDuplicate(tableId), [onDuplicate, tableId]);
    const remove = useCallback(() => onRemove(tableId), [onRemove, tableId]);

    const handleDeleteBlock = useCallback(
        ({ day, time }: { day: string; time: number }) => onDeleteBlock(tableId, day, time),
        [onDeleteBlock, tableId]
    );

    return (
        <Stack width="600px">
            <Flex justifyContent="space-between" alignItems="center">
                <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
                <ButtonGroup size="sm" isAttached>
                    <Button colorScheme="green" onClick={() => openSearch()}>시간표 추가</Button>
                    <Button colorScheme="green" mx="1px" onClick={duplicate}>복제</Button>
                    <Button colorScheme="green" isDisabled={disabledRemoveButton}
                            onClick={remove}>삭제</Button>
                </ButtonGroup>
            </Flex>
            <ScheduleDndProvider>
                <ScheduleTable
                    key={`schedule-table-${index}`}
                    schedules={schedules}
                    tableId={tableId}
                    onScheduleTimeClick={(timeInfo) => openSearch(timeInfo)}
                    onDeleteButtonClick={handleDeleteBlock}
                />
            </ScheduleDndProvider>
        </Stack>
    )
};

export default memo(ScheduleTableWrapper);

