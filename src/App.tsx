import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleProvider } from './contexts';
import { ScheduleTables } from './components/schedule';

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
