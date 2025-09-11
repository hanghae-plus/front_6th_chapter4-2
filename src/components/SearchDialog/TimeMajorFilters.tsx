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
import { memo } from "react";
import { timeMajorComparison } from "../../utils/memoComparison";

const TIME_SLOTS = [
  { id: 1, label: "09:00~09:30" },
  { id: 2, label: "09:30~10:00" },
  { id: 3, label: "10:00~10:30" },
  { id: 4, label: "10:30~11:00" },
  { id: 5, label: "11:00~11:30" },
  { id: 6, label: "11:30~12:00" },
  { id: 7, label: "12:00~12:30" },
  { id: 8, label: "12:30~13:00" },
  { id: 9, label: "13:00~13:30" },
  { id: 10, label: "13:30~14:00" },
  { id: 11, label: "14:00~14:30" },
  { id: 12, label: "14:30~15:00" },
  { id: 13, label: "15:00~15:30" },
  { id: 14, label: "15:30~16:00" },
  { id: 15, label: "16:00~16:30" },
  { id: 16, label: "16:30~17:00" },
  { id: 17, label: "17:00~17:30" },
  { id: 18, label: "17:30~18:00" },
  { id: 19, label: "18:00~18:50" },
  { id: 20, label: "18:55~19:45" },
  { id: 21, label: "19:50~20:40" },
  { id: 22, label: "20:45~21:35" },
  { id: 23, label: "21:40~22:30" },
  { id: 24, label: "22:35~23:25" },
];

interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

interface TimeMajorFiltersProps {
  times: number[];
  majors: string[];
  allMajors: string[];
  onChange: (field: keyof SearchOption, value: SearchOption[keyof SearchOption]) => void;
}

const TimeMajorFilters = memo(({ times, majors, allMajors, onChange }: TimeMajorFiltersProps) => {
  return (
    <HStack spacing={4}>
      <FormControl>
        <FormLabel>시간</FormLabel>
        <CheckboxGroup colorScheme="green" value={times} onChange={(values) => onChange("times", values.map(Number))}>
          <Wrap spacing={1} mb={2}>
            {times
              .sort((a, b) => a - b)
              .map((time) => (
                <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                  <TagLabel>{time}교시</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      onChange(
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
    </HStack>
  );
}, timeMajorComparison);

TimeMajorFilters.displayName = "TimeMajorFilters";

export default TimeMajorFilters;
