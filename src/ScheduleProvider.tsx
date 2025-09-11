import React, { PropsWithChildren } from "react";
import { ScheduleStateProvider } from "./context/ScheduleStateContext.tsx";
import { ScheduleActionsProvider } from "./context/ScheduleActionsContext.tsx";

/**
 * 통합된 Schedule Provider
 * State와 Actions를 분리하여 렌더링 최적화
 */
export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  return (
    <ScheduleStateProvider>
      <ScheduleActionsProvider>{children}</ScheduleActionsProvider>
    </ScheduleStateProvider>
  );
};
