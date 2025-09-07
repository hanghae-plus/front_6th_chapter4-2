import { memo } from "react";
import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from "@chakra-ui/react";
import { SearchOption } from "../../types";
import { TIME_SLOTS } from "../../constants";

interface Props {
  times: number[];
  majors: string[];
  allMajors: string[];
  onChangeSearchOption: (field: keyof SearchOption, value: any) => void;
}

const TimeFilter = memo(({ times, onChangeSearchOption }: Omit<Props, "majors" | "allMajors">) => {
  return (
    <FormControl>
      <FormLabel>시간</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={times}
        onChange={(values) => onChangeSearchOption("times", values.map(Number))}
      >
        <Wrap spacing={1} mb={2}>
          {times.sort((a, b) => a - b).map((time) => (
            <Tag key={time} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{time}교시</TagLabel>
              <TagCloseButton
                onClick={() =>
                  onChangeSearchOption(
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

const MajorFilter = memo(({ majors, allMajors, onChangeSearchOption }: Omit<Props, "times">) => {
  return (
    <FormControl>
      <FormLabel>전공</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={majors}
        onChange={(values) => onChangeSearchOption("majors", values as string[])}
      >
        <Wrap spacing={1} mb={2}>
          {majors.map((major) => (
            <Tag key={major} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{major.split("<p>").pop()}</TagLabel>
              <TagCloseButton
                onClick={() =>
                  onChangeSearchOption(
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
});

TimeFilter.displayName = "TimeFilter";
MajorFilter.displayName = "MajorFilter";

const TimeAndMajorFilter = ({ times, majors, allMajors, onChangeSearchOption }: Props) => {
  return (
    <HStack spacing={4} align="start">
      <TimeFilter times={times} onChangeSearchOption={onChangeSearchOption} />
      <MajorFilter majors={majors} allMajors={allMajors} onChangeSearchOption={onChangeSearchOption} />
    </HStack>
  );
};

export default memo(TimeAndMajorFilter, (prevProps, nextProps) => {
  return (
    prevProps.times.length === nextProps.times.length &&
    prevProps.times.every((time, index) => time === nextProps.times[index]) &&
    prevProps.majors.length === nextProps.majors.length &&
    prevProps.majors.every((major, index) => major === nextProps.majors[index]) &&
    prevProps.allMajors === nextProps.allMajors &&
    prevProps.onChangeSearchOption === nextProps.onChangeSearchOption
  );
});
