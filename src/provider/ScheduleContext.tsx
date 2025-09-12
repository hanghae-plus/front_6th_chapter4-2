import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from "react"
import { Schedule } from "../types.ts"
import dummyScheduleMap from "../dummyScheduleMap.ts"
import { useAutoCallback } from "../hooks/useAutoCallback.ts"

const ScheduleStateContext = createContext<Record<string, Schedule[]> | null>(null)

const ScheduleActionsContext = createContext<{
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>
  onDeleteScheduleButtonClick: (tableId: string, day: string, time: number) => void
} | null>(null)

export const useScheduleState = () => {
  const context = useContext(ScheduleStateContext)
  if (!context) {
    throw new Error("useScheduleState must be used within a ScheduleProvider")
  }
  return context
}

export const useScheduleActions = () => {
  const context = useContext(ScheduleActionsContext)
  if (!context) {
    throw new Error("useScheduleActions must be used within a ScheduleProvider")
  }
  return context
}

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap)

  const onDeleteScheduleButtonClick = useAutoCallback((tableId: string, day: string, time: number) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: prev[tableId].filter((s) => s.day !== day || !s.range.includes(time)),
    }))
  })

  const actions = useMemo(
    () => ({
      setSchedulesMap,
      onDeleteScheduleButtonClick,
    }),
    [setSchedulesMap, onDeleteScheduleButtonClick],
  )

  return (
    <ScheduleActionsContext.Provider value={actions}>
      <ScheduleStateContext.Provider value={schedulesMap}>{children}</ScheduleStateContext.Provider>
    </ScheduleActionsContext.Provider>
  )
}
