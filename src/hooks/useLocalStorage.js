import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export const useSGPAHistory = () => {
  const [history, setHistory] = useLocalStorage('sgpaHistory', []);

  const addCalculation = (calculation) => {
    const newCalculation = {
      id: Date.now(),
      date: new Date().toISOString(),
      sgpa: calculation.sgpa,
      grades: calculation.grades,
      semester: calculation.semester || 'Semester 2',
      totalCredits: calculation.totalCredits
    };
    
    setHistory(prev => [newCalculation, ...prev.slice(0, 9)]); // Keep only last 10 calculations
    return newCalculation.id;
  };

  const removeCalculation = (id) => {
    setHistory(prev => prev.filter(calc => calc.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addCalculation,
    removeCalculation,
    clearHistory
  };
};