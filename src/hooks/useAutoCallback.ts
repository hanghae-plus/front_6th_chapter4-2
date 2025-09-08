import {useCallback, useRef} from 'react'

export const useAutoCallback = <T extends unknown[], R>(callback: (...args: T) => R) => {
	const callbackRef = useRef(callback)
	callbackRef.current = callback
	return useCallback((...args: T) => callbackRef.current(...args), [])
}
