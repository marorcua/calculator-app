import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePersistence<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(key);
        if (savedValue !== null) {
          setState(JSON.parse(savedValue));
        }
      } catch (error) {
        console.error(`Error loading persistence key "${key}":`, error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [key]);

  // Save data to AsyncStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;

    const saveData = async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(`Error saving persistence key "${key}":`, error);
      }
    };

    saveData();
  }, [key, state, isLoaded]);

  return [state, setState, isLoaded] as const;
}
