import { memo, useMemo } from 'react';
import { SearchOption } from '../SearchDialog.tsx';
import { Checkbox, CheckboxGroup } from '@chakra-ui/react/checkbox';
import { Wrap } from '@chakra-ui/react/wrap';
import { Tag, TagCloseButton, TagLabel } from '@chakra-ui/react/tag';
import { Stack } from '@chakra-ui/react/stack';
import { TIME_SLOTS } from '../../../../constants/constants.ts';
import { Box } from '@chakra-ui/react/box';

import { FormControl } from '@chakra-ui/react';

export const CheckTime = memo(
  ({
    selectedTimes,
    changeSearchOption,
  }: {
    selectedTimes: number[];
    changeSearchOption: (
      field: keyof SearchOption,
      value: SearchOption[typeof field]
    ) => void;
  }) => {
    console.log('CheckTime 리렌더링!'); // 이게 출력되는지 확인
    const sortedTimes = useMemo(
      () => [...selectedTimes].sort((a, b) => a - b),
      [selectedTimes]
    );
    return (
      <FormControl>
        <label
          style={{
            display: 'block',
            fontSize: 16,
            fontWeight: 500,
            marginBottom: '0.5rem',
            marginInlineEnd: '0.75rem',
          }}
        >
          시간
        </label>
        <CheckboxGroup
          colorScheme="green"
          value={selectedTimes}
          onChange={values => changeSearchOption('times', values.map(Number))}
        >
          <Wrap spacing={1} mb={2}>
            {sortedTimes
              .sort((a, b) => a - b)
              .map(time => (
                <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                  <TagLabel>{time}교시</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      changeSearchOption(
                        'times',
                        selectedTimes.filter(v => v !== time)
                      )
                    }
                  />
                </Tag>
              ))}
          </Wrap>
          <Stack
            spacing={2}
            overflowY="auto"
            h="100px"
            border="1px solid"
            borderColor="gray.200"
            borderRadius={5}
            p={2}
          >
            {TIME_SLOTS.map(({ id, label }) => (
              <Box key={id}>
                <Checkbox key={id} size="sm" value={id}>
                  {id}교시({label})
                </Checkbox>
              </Box>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>
    );
  }
);
