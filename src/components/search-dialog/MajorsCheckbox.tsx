import { Box, Checkbox, Stack } from "@chakra-ui/react";
import { memo } from "react";

export const MajorsCheckbox = memo(({ items }: { items: string[] }) => {
  return (
    <Stack spacing={2} overflowY="auto" h="100px" border="1px solid" borderColor="gray.200" borderRadius={5} p={2}>
      {items.map((value) => (
        <Box key={value}>
          <Checkbox key={value} size="sm" value={value}>
            {value.replace(/<p>/gi, " ")}
          </Checkbox>
        </Box>
      ))}
    </Stack>
  );
});

MajorsCheckbox.displayName = "MajorsInput";
