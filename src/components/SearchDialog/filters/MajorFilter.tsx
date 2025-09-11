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
import { FilterChangeHandler } from "../types";

interface MajorFilterProps {
  majors: string[];
  allMajors: string[];
  onChange: FilterChangeHandler;
}

const MajorFilter = memo(
  ({ majors, allMajors, onChange }: MajorFilterProps) => {
    console.log("MajorFilter 리렌더링");

    return (
      <FormControl>
        <FormLabel>전공</FormLabel>
        <CheckboxGroup colorScheme="green" value={majors} onChange={(values) => onChange("majors", values as string[])}>
          <Wrap spacing={1} mb={2}>
            {majors.map((major) => (
              <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{major.split("<p>").pop()}</TagLabel>
                <TagCloseButton
                  onClick={() =>
                    onChange(
                      "majors",
                      majors.filter((v) => v !== major)
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
  },
  (prev, next) => {
    return (
      prev.majors.length === next.majors.length &&
      prev.majors.every((major, index) => major === next.majors[index]) &&
      prev.allMajors.length === next.allMajors.length &&
      prev.allMajors.every((major, index) => major === next.allMajors[index]) &&
      prev.onChange === next.onChange
    );
  }
);

MajorFilter.displayName = "MajorFilter";

export default MajorFilter;
