import { useState, useEffect, useMemo } from "react";
import { Repository } from "@/domain/repositories/Repository";
import { AsyncStorageRepository } from "@/infrastructure/persistence/AsyncStorageRepository";

export function usePersistence<T extends object>(key: string, initialValue: T) {
  const repository = useMemo(() => new AsyncStorageRepository<T>(key), [key]);
  const [state, setState] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedValue = await repository.load();
        if (savedValue !== null) {
          setState({ ...initialValue, ...savedValue });
        }
      } catch (error) {
        console.error(`Error loading persistence key "${key}":`, error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [key, repository]);

  useEffect(() => {
    if (!isLoaded) return;

    const saveData = async () => {
      try {
        await repository.save(state);
      } catch (error) {
        console.error(`Error saving persistence key "${key}":`, error);
      }
    };

    saveData();
  }, [key, state, isLoaded, repository]);

  return [state, setState, isLoaded] as const;
}
