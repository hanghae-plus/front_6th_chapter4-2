import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleProvider } from './ScheduleContext.tsx';

import ScheduleDndProvider from './ScheduleDndProvider.tsx';
import { lazy, Suspense } from 'react';
const ScheduleTables = lazy(() => import('./ScheduleTables.tsx'));

function App() {
  return (
    <ChakraProvider>
      <ScheduleProvider>
        <ScheduleDndProvider>
          <Suspense fallback={<div>잠시만요</div>}>
            <ScheduleTables />
          </Suspense>
        </ScheduleDndProvider>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
