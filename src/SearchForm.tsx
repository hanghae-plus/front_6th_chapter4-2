import { Box, Checkbox, HStack, Stack, Tag, TagCloseButton, TagLabel, Wrap } from "@chakra-ui/react";
import React, { memo, useMemo } from "react";
import { SearchOption } from "./types/type";
import { useAutoCallback } from "./hooks/useAutoCallback";
import SearchInput from "./components/SearchInput";
import SearchSelect from "./components/SearchSelect";
import SearchCheckBox from "./components/SearchCheckBox";
import { DAY_LABELS, TIME_SLOTS } from "./constants";

const FirstSearchForm = memo(
  ({
    query,
    credits,
    grades,
    days,
    times,
    majors,
    allMajors,
    changeSearchOption,
    loaderWrapperRef,
  }: {
    query: SearchOption["query"];
    credits: SearchOption["credits"];
    grades: SearchOption["grades"];
    days: SearchOption["days"];
    times: number[];
    majors: string[];
    allMajors: string[];
    changeSearchOption: (
      field: keyof SearchOption,
      value: SearchOption[typeof field],
      loaderWrapperRef: React.RefObject<HTMLDivElement | null>,
    ) => void;
    loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  }) => {
    const handleKeywordChange = useAutoCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("handleGradesChange 호출됨");
      changeSearchOption("query", e.target.value, loaderWrapperRef);
    });

    const handleCreditsChange = useAutoCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      console.log("handleGradeChange 호출됨");
      changeSearchOption("credits", e.target.value, loaderWrapperRef);
    });

    const handleGradesChange = useAutoCallback((value) => {
      console.log("handleGradesChange 호출됨");
      changeSearchOption("grades", value.map(Number), loaderWrapperRef);
    });

    const handleDaysChange = useAutoCallback((value) => {
      console.log("handleDaysChange 호출됨");
      changeSearchOption("days", value as string[], loaderWrapperRef);
    });

    const handleTimeChange = useAutoCallback((value) => {
      console.log("handleTimeChange 호출됨");
      changeSearchOption("times", value.map(Number), loaderWrapperRef);
    });

    const handleTimeRemove = useAutoCallback((time) => {
      console.log("handleTimeRemove 호출됨");
      changeSearchOption(
        "times",
        times.filter((v) => v !== time),
        loaderWrapperRef,
      );
    });

    const handleMajorRemove = useAutoCallback((majors) => {
      console.log("handleTimeRemove 호출됨");
      changeSearchOption(
        "majors",
        majors.filter((v: string) => v !== majors),
        loaderWrapperRef,
      );
    });

    const handleMajorsChange = useAutoCallback((value) => {
      console.log("handleMajorsChange 호출됨");
      changeSearchOption("majors", value as string[], loaderWrapperRef);
    });

    const sortedTimes = useMemo(() => times.sort((a, b) => a - b), [times]);

    return (
      <>
        <HStack spacing={4}>
          <SearchInput value={query ?? ""} handleChange={handleKeywordChange}></SearchInput>
          <SearchSelect value={credits} handleChange={handleCreditsChange} />
        </HStack>
        <HStack spacing={4}>
          <SearchCheckBox label="학년" value={grades} handleChange={handleGradesChange}>
            <HStack spacing={4}>
              {[1, 2, 3, 4].map((grade) => (
                <Checkbox key={grade} value={grade}>
                  {grade}학년
                </Checkbox>
              ))}
            </HStack>
          </SearchCheckBox>
          <SearchCheckBox label="요일" value={days} handleChange={handleDaysChange}>
            <HStack spacing={4}>
              {DAY_LABELS.map((day) => (
                <Checkbox key={day} value={day}>
                  {day}
                </Checkbox>
              ))}
            </HStack>
          </SearchCheckBox>
        </HStack>
        <HStack spacing={4}>
          <SearchCheckBox label="시간" value={times} handleChange={handleTimeChange}>
            <>
              <Wrap spacing={1} mb={2}>
                {sortedTimes.map((time) => (
                  <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                    <TagLabel>{time}교시</TagLabel>
                    <TagCloseButton onClick={() => handleTimeRemove(time)} />
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
            </>
          </SearchCheckBox>
          <SearchCheckBox label="전공" value={majors} handleChange={handleMajorsChange}>
            <>
              <Wrap spacing={1} mb={2}>
                {majors.map((major) => (
                  <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                    <TagLabel>{major.split("<p>").pop()}</TagLabel>
                    <TagCloseButton onClick={() => handleMajorRemove(major)} />
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
            </>
          </SearchCheckBox>
        </HStack>
      </>
    );
  },
);

export default FirstSearchForm;
