import { useCallback, useMemo } from "react";
import { debounce } from "lodash";
import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from "@chakra-ui/react";
import { DAY_LABELS, TIME_SLOTS } from "../constants";
import { SearchOption } from "../types";

interface Props {
  searchOptions: SearchOption;
  allMajors: string[];
  onChangeSearchOption: (field: keyof SearchOption, value: any) => void;
}

const SearchFilter = ({ searchOptions, allMajors, onChangeSearchOption }: Props) => {
  const debouncedSetSearchOptions = useCallback(
    debounce((field: keyof SearchOption, value: any) => {
      onChangeSearchOption(field, value);
    }, 300),
    [onChangeSearchOption],
  );

  const handleSearchOptionChange = useCallback(
    (field: keyof SearchOption, value: any) => {
      if (field === "query") {
        debouncedSetSearchOptions(field, value);
      } else {
        onChangeSearchOption(field, value);
      }
    },
    [debouncedSetSearchOptions, onChangeSearchOption],
  );

  return (
    <>
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>검색어</FormLabel>
          <Input
            placeholder="과목명 또는 과목코드"
            value={searchOptions.query}
            onChange={(e) => handleSearchOptionChange("query", e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>학점</FormLabel>
          <Select value={searchOptions.credits} onChange={(e) => handleSearchOptionChange("credits", e.target.value)}>
            <option value="">전체</option>
            <option value="1">1학점</option>
            <option value="2">2학점</option>
            <option value="3">3학점</option>
          </Select>
        </FormControl>
      </HStack>

      <HStack spacing={4}>
        <FormControl>
          <FormLabel>학년</FormLabel>
          <CheckboxGroup
            value={searchOptions.grades}
            onChange={(value) => handleSearchOptionChange("grades", value.map(Number))}
          >
            <HStack spacing={4}>
              {[1, 2, 3, 4].map((grade) => (
                <Checkbox key={grade} value={grade}>
                  {grade}학년
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
        </FormControl>

        <FormControl>
          <FormLabel>요일</FormLabel>
          <CheckboxGroup
            value={searchOptions.days}
            onChange={(value) => handleSearchOptionChange("days", value as string[])}
          >
            <HStack spacing={4}>
              {DAY_LABELS.map((day) => (
                <Checkbox key={day} value={day}>
                  {day}
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
        </FormControl>
      </HStack>

      <HStack spacing={4}>
        <FormControl>
          <FormLabel>시간</FormLabel>
          <CheckboxGroup
            colorScheme="green"
            value={searchOptions.times}
            onChange={(values) => handleSearchOptionChange("times", values.map(Number))}
          >
            <Wrap spacing={1} mb={2}>
              {searchOptions.times
                .sort((a, b) => a - b)
                .map((time) => (
                  <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                    <TagLabel>{time}교시</TagLabel>
                    <TagCloseButton
                      onClick={() =>
                        handleSearchOptionChange(
                          "times",
                          searchOptions.times.filter((v) => v !== time),
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
          <CheckboxGroup
            colorScheme="green"
            value={searchOptions.majors}
            onChange={(values) => handleSearchOptionChange("majors", values as string[])}
          >
            <Wrap spacing={1} mb={2}>
              {searchOptions.majors.map((major) => (
                <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                  <TagLabel>{major.split("<p>").pop()}</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      handleSearchOptionChange(
                        "majors",
                        searchOptions.majors.filter((v) => v !== major),
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
    </>
  );
};

export default SearchFilter;
