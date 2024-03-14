import { useState } from "react";

const useLocalStorage = (key: string, initialValue: string = "") => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  const setStoredValue = (newValue: any) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };
  const removeStoredValue = (key: string) => {
    localStorage.removeItem(key);
  };
  return { value, setStoredValue, removeStoredValue };
};

export default useLocalStorage;
