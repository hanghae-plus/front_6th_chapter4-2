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

interface MajorFilterProps {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}

export const MajorFilter = memo(
  ({ options, selected, onChange }: MajorFilterProps) => (
    <FormControl>
      <FormLabel>전공</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={selected}
        onChange={(values) => onChange(values as string[])}
      >
        <Wrap spacing={1} mb={2}>
          {selected.map((major) => (
            <Tag key={major} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{major.split("<p>").pop()}</TagLabel>
              <TagCloseButton onClick={() => onChange(selected.filter((v) => v !== major))} />
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
          {options.map((major) => (
            <Box key={major}>
              <Checkbox size="sm" value={major}>
                {major.replace(/<p>/gi, " ")}
              </Checkbox>
            </Box>
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  ),
  (prevProps, nextProps) =>
    prevProps.options === nextProps.options &&
    prevProps.selected === nextProps.selected &&
    prevProps.onChange === nextProps.onChange
);

MajorFilter.displayName = "MajorFilter";