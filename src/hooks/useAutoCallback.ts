import { useCallback, useRef } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any

export function useAutoCallback<T extends AnyFunction>(fn: T): T {
  const ref = useRef<T>(fn)
  ref.current = fn

  const autoCallback = useCallback((...args: Parameters<T>) => {
    return ref.current(...args)
  }, [])
  return autoCallback as T
}
