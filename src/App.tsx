import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleProvider, ScheduleTables } from "./components";

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
