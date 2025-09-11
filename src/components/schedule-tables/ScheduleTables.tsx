import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { useScheduleContext } from '../../ScheduleContext';
import { useScheduleTableIds } from '../../hooks/useScheduleTable';
import { SearchInfo } from '../../types';
import { SearchDialog } from '../search-dialog/SearchDialog';
import { ScheduleTableContainer } from './ScheduleTableContainer';

export const ScheduleTables = memo(() => {
  const { schedulesMap, actions } = useScheduleContext();
  const tableIds = useScheduleTableIds(schedulesMap);
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  const disabledRemoveButton = tableIds.length === 1;

  return (
    <>
      <Flex w='full' gap={6} p={6} flexWrap='wrap'>
        {tableIds.map((tableId, index) => (
          <Stack key={tableId} width='600px'>
            <Flex justifyContent='space-between' alignItems='center'>
              <Heading as='h3' fontSize='lg'>
                시간표 {index + 1}
              </Heading>
              <ButtonGroup size='sm' isAttached>
                <Button
                  colorScheme='green'
                  onClick={() => setSearchInfo({ tableId })}
                >
                  시간표 추가
                </Button>
                <Button
                  colorScheme='green'
                  mx='1px'
                  onClick={() => actions.duplicateTable(tableId)}
                >
                  복제
                </Button>
                <Button
                  colorScheme='green'
                  isDisabled={disabledRemoveButton}
                  onClick={() => actions.deleteTable(tableId)}
                >
                  삭제
                </Button>
              </ButtonGroup>
            </Flex>
            <ScheduleTableContainer
              tableId={tableId}
              onScheduleTimeClick={(timeInfo) =>
                setSearchInfo({ tableId, ...timeInfo })
              }
            />
          </Stack>
        ))}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
});

ScheduleTables.displayName = 'ScheduleTables';
