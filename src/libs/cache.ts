import { AxiosResponse } from "axios";
import { Lecture } from "../types";

class CacheStorage<T> {
  private storage: Map<string, T>;
  constructor() {
    this.storage = new Map();
  }

  get(key: string): T | undefined {
    return this.storage.get(key);
  }

  set(key: string, value: T): void {
    this.storage.set(key, value);
  }

  has(key: string): boolean {
    return this.storage.has(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

export const cache = new CacheStorage<Promise<AxiosResponse<Lecture[], unknown>>>();