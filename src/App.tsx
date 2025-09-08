import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleProvider } from "./context/ScheduleContext.tsx";
import ScheduleDndProvider from "./context/ScheduleDndProvider.tsx";
import { ScheduleTables } from "./components/ScheduleTables.tsx";

function App() {
  return (
    <ChakraProvider>
      <ScheduleProvider>
        <ScheduleDndProvider>
          <ScheduleTables />
        </ScheduleDndProvider>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
