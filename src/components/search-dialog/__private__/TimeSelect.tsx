import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from "@chakra-ui/react";
import { memo, useCallback } from "react";

import { TIME_SLOTS } from "../../../constants";

type TimeSelectProps = {
  value: number[];
  onChange: (value: number[]) => void;
};

export function TimeSelect({ value, onChange }: TimeSelectProps) {
  const handleChange = useCallback(
    (values: (string | number)[]) => {
      onChange(values.map(Number));
    },
    [onChange],
  );

  const handleRemoveTime = useCallback(
    (timeToRemove: number) => {
      onChange(value.filter((time) => time !== timeToRemove));
    },
    [value, onChange],
  );

  return (
    <FormControl>
      <FormLabel>시간</FormLabel>
      <CheckboxGroup colorScheme="green" value={value} onChange={handleChange}>
        <Wrap spacing={1} mb={2}>
          {value
            .sort((a, b) => a - b)
            .map((time) => (
              <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{time}교시</TagLabel>
                <TagCloseButton onClick={() => handleRemoveTime(time)} />
              </Tag>
            ))}
        </Wrap>
        <Stack spacing={2} overflowY="auto" h="100px" border="1px solid" borderColor="gray.200" borderRadius={5} p={2}>
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

export const MemoizedTimeSelect = memo(TimeSelect);
