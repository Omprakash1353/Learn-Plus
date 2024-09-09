import { useState } from "react";

import { getErrorMessage } from "@/helpers/errorHandler";

export function useLocalStorage<T>(key: string, initialValue?: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue as T;
    }
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
      return initialValue !== undefined ? initialValue : (undefined as T);
    } catch (err: unknown) {
      console.log(getErrorMessage(err));
      return initialValue as T;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (err: unknown) {
      console.log(getErrorMessage(err));
    }
  };

  return [storedValue, setValue] as const;
}
