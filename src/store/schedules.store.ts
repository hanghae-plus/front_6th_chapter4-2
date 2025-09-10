import { Schedule } from '../types.ts';
import dummyScheduleMap from '../mocks/dummyScheduleMap.ts';

class ScheduleStore {
  private schedules = new Map<string, Schedule[]>();
  private listeners = new Map<string, Set<() => void>>();
  private globalListeners = new Set<() => void>();

  private cachedSchedulesMap: Record<string, Schedule[]> | null = null;

  private initializeFromDummy() {
    Object.entries(dummyScheduleMap).forEach(([tableId, schedules]) => {
      this.schedules.set(tableId, schedules);
    });
    this.invalidateCache();
  }

  private invalidateCache() {
    this.cachedSchedulesMap = null;
  }

  constructor() {
    this.initializeFromDummy();
  }

  subscribeAll(callback: () => void) {
    this.globalListeners.add(callback);
    return () => this.globalListeners.delete(callback);
  }
  subscribe(tableId: string, callback: () => void) {
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
    this.invalidateCache();
    this.listeners.get(tableId)?.forEach(callback => callback());
    // this.notifyGlobalListeners(); // ← 전체 리스너에게도 알림
  }

  getSchedulesMap(): Record<string, Schedule[]> {
    if (!this.cachedSchedulesMap) {
      this.cachedSchedulesMap = Object.fromEntries(this.schedules);
    }

    return this.cachedSchedulesMap;
  }

  duplicateTable(sourceTableId: string): string {
    const sourceSchedules = this.getTableSchedules(sourceTableId);
    const newTableId = `schedule-${Date.now()}`;
    this.updateTable(newTableId, [...sourceSchedules]);
    return newTableId;
  }

  removeTable(tableId: string) {
    this.schedules.delete(tableId);
    this.listeners.delete(tableId);
    this.invalidateCache();
    // this.notifyGlobalListeners();
  }

  removeSchedule(tableId: string, day: string, time: number) {
    const currentSchedules = this.getTableSchedules(tableId);
    const updatedSchedules = currentSchedules.filter(
      schedule => schedule.day !== day || !schedule.range.includes(time)
    );
    this.updateTable(tableId, updatedSchedules);
  }

  addSchedule(tableId: string, schedule: Schedule[]) {
    const currentSchedules = this.getTableSchedules(tableId);
    console.log('Current : ', currentSchedules);
    this.invalidateCache();
    this.updateTable(tableId, [...currentSchedules, ...schedule]);
  }
}

export const store = new ScheduleStore();
