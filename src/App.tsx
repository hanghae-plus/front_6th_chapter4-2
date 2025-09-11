import { ChakraProvider } from "@chakra-ui/react";

import { ScheduleTables } from "./components";
import { ScheduleProvider, ScheduleDndProvider } from "./contexts";

export function App() {
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
