import {Flex, GridItem, Text} from '@chakra-ui/react'
import {memo} from 'react'

export const DayHeaderCell = memo(({day}: {day: string}) => (
	<GridItem borderLeft='1px' borderColor='gray.300' bg='gray.100'>
		<Flex justifyContent='center' alignItems='center' h='full'>
			<Text fontWeight='bold'>{day}</Text>
		</Flex>
	</GridItem>
))
