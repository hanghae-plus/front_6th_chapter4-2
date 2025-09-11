import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleTables } from './components/ScheduleTables.tsx';
import { ScheduleProvider } from './context/ScheduleContext.tsx';

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
