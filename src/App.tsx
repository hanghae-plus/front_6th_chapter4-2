import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleProvider } from "./contexts/ScheduleContext.tsx";
import { ScheduleTables } from "./components/ScheduleTable/ScheduleTables.tsx";

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
