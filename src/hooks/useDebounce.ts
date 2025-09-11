import { useState, useEffect } from "react";

/**
 * @param value 값
 * @param delay 딜레이
 * @returns 디바운스 값
 */
function useDebounce(value: string, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue };
}

export default useDebounce;
