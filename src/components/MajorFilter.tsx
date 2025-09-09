import { memo } from "react";
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

interface MajorFilterProps {
  majors: string[];
  allMajors: string[];
  onMajorsChange: (values: (string | number)[]) => void;
  onMajorRemove: (majorToRemove: string) => void;
}

const MajorFilter = memo(
  ({ majors, allMajors, onMajorsChange, onMajorRemove }: MajorFilterProps) => {
    return (
      <FormControl>
        <FormLabel>전공</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={majors}
          onChange={onMajorsChange}>
          <Wrap spacing={1} mb={2}>
            {majors.map((major) => (
              <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{major.split("<p>").pop()}</TagLabel>
                <TagCloseButton onClick={() => onMajorRemove(major)} />
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
            p={2}>
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

MajorFilter.displayName = "MajorFilter";

export default MajorFilter;
