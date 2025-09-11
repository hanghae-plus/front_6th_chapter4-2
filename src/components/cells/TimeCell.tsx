import { Flex, GridItem, Text } from "@chakra-ui/react";
import { memo } from "react";
import { fill2 } from "../../utils";

interface Props {
  time: string;
  timeIndex: number;
}

function TimeCell({ time, timeIndex }: Props) {
  return (
    <GridItem
      borderTop="1px solid"
      borderColor="gray.300"
      bg={timeIndex > 17 ? "gray.200" : "gray.100"}
    >
      <Flex justifyContent="center" alignItems="center" h="full">
        <Text fontSize="xs">
          {fill2(timeIndex + 1)} ({time})
        </Text>
      </Flex>
    </GridItem>
  );
}

export default memo(TimeCell);
