import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleProvider } from "./provider/ScheduleContext.tsx";
import { ScheduleTables } from "./component/schedule/ScheduleTables.tsx";
import ScheduleDndProvider from "./provider/ScheduleDndProvider.tsx";

function App() {

  return (
    <ChakraProvider>
      <ScheduleProvider>
        <ScheduleDndProvider>
          <ScheduleTables/>
        </ScheduleDndProvider>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
