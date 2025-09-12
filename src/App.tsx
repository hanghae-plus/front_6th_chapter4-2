import { ChakraProvider } from "@chakra-ui/react";

import { ScheduleTables } from "./components";
import { ScheduleProvider } from "./contexts";

export function App() {
  return (
    <ChakraProvider>
      <ScheduleProvider>
        <ScheduleTables />
      </ScheduleProvider>
    </ChakraProvider>
  );
}
