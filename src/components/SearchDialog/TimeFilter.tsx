import {
  FormControl,
  FormLabel,
  CheckboxGroup,
  Wrap,
  Tag,
  TagLabel,
  TagCloseButton,
  Stack,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import { memo } from "react";
import { TIME_SLOTS } from "../../constants";

export const TimeFilter = memo(
  ({ selectedTimes, onChange }: { selectedTimes: (string | number)[]; onChange: Function }) => {
    return (
      <FormControl>
        <FormLabel>시간</FormLabel>
        <CheckboxGroup
          value={selectedTimes}
          onChange={(values: (string | number)[]) => onChange("times", values.map(Number))}
        >
          <Wrap spacing={1} mb={2}>
            {selectedTimes
              .sort((a, b) => Number(a) - Number(b))
              .map((time) => (
                <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                  <TagLabel>{time}교시</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      onChange(
                        "times",
                        selectedTimes.filter((v) => v !== time)
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
TimeFilter.displayName = "TimeFilter";
