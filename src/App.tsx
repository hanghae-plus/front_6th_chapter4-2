import { ChakraProvider } from "@chakra-ui/react";

import { ScheduleProvider } from "./ScheduleContext";
import ScheduleDndProvider from "./ScheduleDndProvider";
import { ScheduleTables } from "./ScheduleTables";

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
