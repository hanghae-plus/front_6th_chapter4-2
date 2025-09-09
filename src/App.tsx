import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleProvider } from './ScheduleContext.tsx';

import { lazy } from 'react';
const ScheduleTables = lazy(() => import('./ScheduleTables.tsx'));

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
