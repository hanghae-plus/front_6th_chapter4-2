import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleProvider } from "./context/ScheduleContext.tsx";
import { ScheduleTables } from "./components/ScheduleTables.tsx";

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
