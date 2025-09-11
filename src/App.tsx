import { ChakraProvider } from '@chakra-ui/react';

import { lazy } from 'react';
const ScheduleTables = lazy(
  () => import('./components/schedules/SchedulesTable/ScheduleTables.tsx')
);

function App() {
  return (
    <ChakraProvider>
      <ScheduleTables />
    </ChakraProvider>
  );
}

export default App;
