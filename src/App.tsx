import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleTables } from "./ScheduleTables/ScheduleTables.tsx";

function App() {
	return (
		<ChakraProvider>
			<ScheduleTables />
		</ChakraProvider>
	);
}

export default App;
