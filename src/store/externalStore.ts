import { Schedule } from '../types.ts';

class ScheduleStore {
  private schedules = new Map<string, Schedule[]>();
  private listeners = new Set<() => void>();
  private cache = new Map<string, Schedule[]>();

  getTableSchedules(tableId: string) {
    if (!this.cache.has(tableId)) {
      this.cache.set(tableId, []);
    }
    console.log(this.schedules);
    return this.cache.get(tableId) || [];
  }

  updateTable(tableId: string, schedules: Schedule[]) {
    this.schedules.set(tableId, schedules);
    this.cache.set(tableId, schedules);
    this.notifyListeners();
  }

  subscribe(tableId: string, callback: () => void) {
    console.log(tableId);
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  initializeFromContext(schedulesMap: Record<string, Schedule[]>) {
    Object.entries(schedulesMap).forEach(([tableId, schedules]) => {
      this.schedules.set(tableId, schedules);
      this.cache.set(tableId, schedules);
    });
  }
}

export const store = new ScheduleStore();
