import { Flex, GridItem, Text } from '@chakra-ui/react';

const DayHeader = ({ day }: { day: string }) => {
  return (
    <GridItem key={day} borderLeft="1px" borderColor="gray.300" bg="gray.100">
      <Flex justifyContent="center" alignItems="center" h="full">
        <Text fontWeight="bold">{day}</Text>
      </Flex>
    </GridItem>
  );
};

DayHeader.displayName = 'DayHeader';

export default DayHeader;
