import { memo } from "react";
import { Stack, Box, Checkbox } from "@chakra-ui/react";

interface Props {
  allMajors: string[];
}

const MajorList = memo(
  ({ allMajors }: Props) => {
    return (
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
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.allMajors.length === nextProps.allMajors.length &&
      prevProps.allMajors.every(
        (major, index) => major === nextProps.allMajors[index]
      )
    );
  }
);

export default MajorList;
