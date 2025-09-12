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

type MajorSelectProps = {
  allMajors: string[];
  value: string[];
  onChange: (value: string[]) => void;
};

export function MajorSelect({ allMajors, value, onChange }: MajorSelectProps) {
  const handleChange = useCallback(
    (values: (string | number)[]) => {
      onChange(values as string[]);
    },
    [onChange],
  );

  const handleRemoveMajor = useCallback(
    (majorToRemove: string) => {
      onChange(value.filter((major) => major !== majorToRemove));
    },
    [value, onChange],
  );

  return (
    <FormControl>
      <FormLabel>전공</FormLabel>
      <CheckboxGroup colorScheme="green" value={value} onChange={handleChange}>
        <Wrap spacing={1} mb={2}>
          {value.map((major) => (
            <Tag key={major} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{major.split("<p>").pop()}</TagLabel>
              <TagCloseButton onClick={() => handleRemoveMajor(major)} />
            </Tag>
          ))}
        </Wrap>
        <Stack spacing={2} overflowY="auto" h="100px" border="1px solid" borderColor="gray.200" borderRadius={5} p={2}>
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

export const MemoizedMajorSelect = memo(MajorSelect);
