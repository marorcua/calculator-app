import AsyncStorage from "@react-native-async-storage/async-storage";
import { Repository } from "@/domain/repositories/Repository";

export class AsyncStorageRepository<T> implements Repository<T> {
  constructor(private key: string) {}

  async load(): Promise<T | null> {
    const savedValue = await AsyncStorage.getItem(this.key);
    return savedValue ? JSON.parse(savedValue) : null;
  }

  async save(data: T): Promise<void> {
    await AsyncStorage.setItem(this.key, JSON.stringify(data));
  }
}
