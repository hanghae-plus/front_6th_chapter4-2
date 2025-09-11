import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleProvider } from "./Provider/ScheduleProvider.tsx";
import { ScheduleTables } from "./components/Schedule/ScheduleTables.tsx";

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
