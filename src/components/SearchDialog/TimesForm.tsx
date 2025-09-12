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
import { memo, useMemo } from "react";
import { SearchOption } from "../../SearchDialog";
import { TIME_SLOTS } from "../../constants";

type TimesFormProps = {
  times: Array<number>;
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
};

const TimesForm = memo(({ times, changeSearchOption }: TimesFormProps) => {
  const sortTimes = useMemo(() => times.sort((a, b) => a - b), [times]);

  return (
    <FormControl>
      <FormLabel>시간</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={times}
        onChange={(values) => changeSearchOption("times", values.map(Number))}
      >
        <Wrap spacing={1} mb={2}>
          {sortTimes.map((time) => (
            <Tag key={time} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{time}교시</TagLabel>
              <TagCloseButton
                onClick={() =>
                  changeSearchOption(
                    "times",
                    times.filter((v) => v !== time)
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
});

export default TimesForm;
