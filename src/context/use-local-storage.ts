/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export const useLocalStorage = <T>(
  keyName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue: T
) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: any) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      /* empty */
    }
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};
