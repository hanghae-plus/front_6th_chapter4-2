import {
  Checkbox,
  FormLabel,
  Tag,
  Wrap,
  TagLabel,
  TagCloseButton,
  FormControl,
  CheckboxGroup,
  Stack,
  Box,
} from "@chakra-ui/react";

import { SearchOption } from "../../../types";
import { memo } from "react";

export const SearchMajorsFilter = memo(
  ({
    searchOptions,
    onChange,
    allMajors,
  }: {
    searchOptions: SearchOption["majors"];
    onChange: (value: SearchOption["majors"]) => void;

    allMajors: string[];
  }) => {
    return (
      <FormControl>
        <FormLabel>전공</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={searchOptions}
          onChange={(values) => onChange(values as string[])}
        >
          <Wrap
            spacing={1}
            mb={2}
          >
            {searchOptions.map((major) => (
              <Tag
                key={major}
                size="sm"
                variant="outline"
                colorScheme="blue"
              >
                <TagLabel>{major.split("<p>").pop()}</TagLabel>
                <TagCloseButton
                  onClick={() =>
                    onChange(searchOptions.filter((v) => v !== major))
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
            {allMajors.map((major) => (
              <Box key={major}>
                <Checkbox
                  key={major}
                  size="sm"
                  value={major}
                >
                  {major.replace(/<p>/gi, " ")}
                </Checkbox>
              </Box>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>
    );
  }
);

SearchMajorsFilter.displayName = "SearchMajorsFilter";
