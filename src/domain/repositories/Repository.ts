export interface Repository<T> {
  load(): Promise<T | null>;
  save(data: T): Promise<void>;
}
