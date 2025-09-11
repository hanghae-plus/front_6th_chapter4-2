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
import { TIME_SLOTS } from "../../constants";

interface Props {
  times: number[];
  onTimesChange: (times: number[]) => void;
}

function TimeForm({ times, onTimesChange }: Props) {
  return (
    <FormControl>
      <FormLabel>시간</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={times}
        onChange={(values) => onTimesChange(values.map(Number))}
      >
        <Wrap spacing={1} mb={2}>
          {times
            .sort((a, b) => a - b)
            .map((time) => (
              <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{time}교시</TagLabel>
                <TagCloseButton
                  onClick={() => onTimesChange(times.filter((v) => v !== time))}
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

export default TimeForm;
