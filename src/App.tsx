import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleProvider } from './ScheduleContext.tsx';

import { lazy } from 'react';
const ScheduleTables = lazy(
  () => import('./components/schedules/SchedulesTable/ScheduleTables.tsx')
);

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
