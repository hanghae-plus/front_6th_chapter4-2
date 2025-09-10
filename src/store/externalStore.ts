import { Schedule } from '../types.ts';
import dummyScheduleMap from '../mocks/dummyScheduleMap.ts';

class ScheduleStore {
  private schedules = new Map<string, Schedule[]>();
  private listeners = new Map<string, Set<() => void>>();

  private initializeFromDummy() {
    Object.entries(dummyScheduleMap).forEach(([tableId, schedules]) => {
      this.schedules.set(tableId, schedules);
    });
  }

  constructor() {
    this.initializeFromDummy();
  }

  subscribe(tableId: string, callback: () => void) {
    console.log(tableId);
    if (!this.listeners.has(tableId)) {
      this.listeners.set(tableId, new Set());
    }
    this.listeners.get(tableId)!.add(callback);

    return () => {
      this.listeners.get(tableId)?.delete(callback);
    };
  }
  getTableSchedules(tableId: string) {
    return this.schedules.get(tableId) || [];
  }

  updateTable(tableId: string, schedules: Schedule[]) {
    this.schedules.set(tableId, schedules);
    this.listeners.get(tableId)?.forEach(callback => callback());
  }

  getSchedulesMap(): Record<string, Schedule[]> {
    return Object.fromEntries(this.schedules);
  }

  setSchedulesMap(
    updater: (prev: Record<string, Schedule[]>) => Record<string, Schedule[]>
  ) {
    const currentMap = this.getSchedulesMap();
    const newMap = updater(currentMap);

    Object.entries(newMap).forEach(([tableId, schedules]) => {
      if (this.schedules.get(tableId) !== schedules) {
        this.updateTable(tableId, schedules);
      }
    });
  }
}

export const store = new ScheduleStore();
