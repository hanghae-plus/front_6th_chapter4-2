import { memo } from "react";
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
import { TIME_SLOTS } from "../../../constants";

interface TimeFilterProps {
  selected: number[];
  onChange: (v: number[]) => void;
}

export const TimeFilter = memo(
  ({ selected, onChange }: TimeFilterProps) => (
    <FormControl>
      <FormLabel>시간</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={selected}
        onChange={(values) => onChange((values as (string | number)[]).map(Number))}
      >
        <Wrap spacing={1} mb={2}>
          {[...selected]
            .sort((a, b) => a - b)
            .map((time) => (
              <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{time}교시</TagLabel>
                <TagCloseButton onClick={() => onChange(selected.filter((v) => v !== time))} />
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
              <Checkbox size="sm" value={id}>
                {id}교시({label})
              </Checkbox>
            </Box>
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  ),
  (prevProps, nextProps) =>
    prevProps.selected === nextProps.selected &&
    prevProps.onChange === nextProps.onChange
);

TimeFilter.displayName = "TimeFilter";