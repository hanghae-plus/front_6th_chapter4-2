import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Tag,
  Wrap,
  Stack,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import { SearchOption } from "../../types";
import { memo } from "react";
import { TIME_SLOTS } from "../../constants";

export const SearchTimesFilter = memo(
  ({
    searchOptions,
    changeSearchOption,
  }: {
    searchOptions: SearchOption["times"];
    changeSearchOption: (
      field: keyof SearchOption,
      value: SearchOption[typeof field]
    ) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>시간</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={searchOptions}
          onChange={(values) => changeSearchOption("times", values.map(Number))}
        >
          <Wrap spacing={1} mb={2}>
            {searchOptions
              .sort((a, b) => a - b)
              .map((time) => (
                <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                  <TagLabel>{time}교시</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      changeSearchOption(
                        "times",
                        searchOptions.filter((v) => v !== time)
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
