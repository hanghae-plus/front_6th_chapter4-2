import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleProvider } from "./ScheduleContext";
import { ScheduleTables } from "./ScheduleTables";
import ScheduleDndProvider from "./ScheduleDndProvider";

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
