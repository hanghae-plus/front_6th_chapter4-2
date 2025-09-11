import {
  Select,
  FormControl,
  FormLabel,
  CheckboxGroup,
  HStack,
  Checkbox,
  Wrap,
  Tag,
  TagLabel,
  TagCloseButton,
  Stack,
  Box,
  Input,
} from "@chakra-ui/react";
import { SearchOption } from "./SearchDialog";
import { memo } from "react";
import { DAY_LABELS } from "../../constants";

interface BaseControlProps {
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
}

interface CreditsControlProps extends BaseControlProps {
  credits: SearchOption["credits"];
}

interface DaysControlProps extends BaseControlProps {
  days: SearchOption["days"];
}

interface GradesControlProps extends BaseControlProps {
  grades: SearchOption["grades"];
}

interface MajorsControlProps extends BaseControlProps {
  majors: SearchOption["majors"];
  allMajors: string[];
}

interface SearchControlProps extends BaseControlProps {
  query: SearchOption["query"];
}

interface TimesControlProps extends BaseControlProps {
  times: SearchOption["times"];
}

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

const CreditsControl = memo(
  ({ credits, changeSearchOption }: CreditsControlProps) => {
    return (
      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select
          value={credits}
          onChange={(e) => changeSearchOption("credits", e.target.value)}
        >
          <option value="">전체</option>
          <option value="1">1학점</option>
          <option value="2">2학점</option>
          <option value="3">3학점</option>
        </Select>
      </FormControl>
    );
  }
);

const DaysControl = memo(({ days, changeSearchOption }: DaysControlProps) => {
  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup
        value={days}
        onChange={(value) => changeSearchOption("days", value as string[])}
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
  );
});

const GradesControl = memo(
  ({ grades, changeSearchOption }: GradesControlProps) => {
    return (
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup
          value={grades}
          onChange={(value) => changeSearchOption("grades", value.map(Number))}
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
    );
  }
);

const MajorsControl = memo(
  ({ majors, allMajors, changeSearchOption }: MajorsControlProps) => {
    return (
      <FormControl>
        <FormLabel>전공</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={majors}
          onChange={(values) =>
            changeSearchOption("majors", values as string[])
          }
        >
          <Wrap spacing={1} mb={2}>
            {majors.map((major) => (
              <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{major.split("<p>").pop()}</TagLabel>
                <TagCloseButton
                  onClick={() =>
                    changeSearchOption(
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
  }
);

const SearchControl = memo(
  ({ query, changeSearchOption }: SearchControlProps) => {
    return (
      <FormControl>
        <FormLabel>검색어</FormLabel>
        <Input
          placeholder="과목명 또는 과목코드"
          value={query}
          onChange={(e) => changeSearchOption("query", e.target.value)}
        />
      </FormControl>
    );
  }
);

const TimesControl = memo(
  ({ times, changeSearchOption }: TimesControlProps) => {
    return (
      <FormControl>
        <FormLabel>시간</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={times}
          onChange={(values) => changeSearchOption("times", values.map(Number))}
        >
          <Wrap spacing={1} mb={2}>
            {times
              .sort((a, b) => a - b)
              .map((time) => (
                <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                  <TagLabel>{time}교시</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      changeSearchOption(
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
  }
);

TimesControl.displayName = "TimesControl";
SearchControl.displayName = "SearchControl";
MajorsControl.displayName = "MajorsControl";
CreditsControl.displayName = "CreditsControl";
DaysControl.displayName = "DaysControl";
GradesControl.displayName = "GradesControl";

export const SearchControls = {
  CreditsControl,
  DaysControl,
  GradesControl,
  MajorsControl,
  SearchControl,
  TimesControl,
};
