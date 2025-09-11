import { Flex, Text, GridItem } from "@chakra-ui/react";
import { memo } from "react";

interface Props {
  day: string;
}

function DayHeaderCell({ day }: Props) {
  return (
    <GridItem borderLeft="1px" borderColor="gray.300" bg="gray.100">
      <Flex justifyContent="center" alignItems="center" h="full">
        <Text fontWeight="bold">{day}</Text>
      </Flex>
    </GridItem>
  );
}

export default memo(DayHeaderCell);
