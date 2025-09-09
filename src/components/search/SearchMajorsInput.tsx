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
import { memo } from "react";

export const SearchMajorsInput = memo(
  ({
    selectedMajors,
    allMajors,
    onChangeCheckbox,
    onCloseTag,
  }: {
    selectedMajors: string[] | undefined;
    allMajors: string[];
    onChangeCheckbox: (value: Array<string | number>) => void;
    onCloseTag: (major: string) => void;
  }) => {
    console.log(selectedMajors);
    return (
      <FormControl>
        <FormLabel>전공</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={selectedMajors}
          onChange={onChangeCheckbox}
        >
          <Wrap spacing={1} mb={2}>
            {selectedMajors?.map((major) => (
              <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{major.split("<p>").pop()}</TagLabel>
                <TagCloseButton onClick={() => onCloseTag(major)} />
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
                <Checkbox key={major} size="sm" value={major}>
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
SearchMajorsInput.displayName = "SearchMajorsInput";
