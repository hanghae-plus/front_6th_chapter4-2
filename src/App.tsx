import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleProvider } from "./provider/ScheduleContext.tsx";
import { ScheduleTables } from "./component/schedule/ScheduleTables.tsx";

function App() {

  return (
    <ChakraProvider>
      <ScheduleProvider>
          <ScheduleTables/>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
