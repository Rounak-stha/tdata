import { useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay: number): { debouncedValue: T; previousValue: T | null } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const previousValueRef = useRef<T | null>(null);
  useEffect(() => {
    const handler = setTimeout(() => {
      previousValueRef.current = debouncedValue;
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue, previousValue: previousValueRef.current };
}
