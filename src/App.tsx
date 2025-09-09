import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleProvider } from './provider/ScheduleContext';
import { ScheduleTables } from './components/schedule/ScheduleTables.tsx';

function App() {
	return (
		<ChakraProvider>
			<ScheduleProvider>
				<ScheduleTables />
			</ScheduleProvider>
		</ChakraProvider>
	);
}

export default App;
