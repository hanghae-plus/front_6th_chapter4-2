import { Schedule } from '../types.ts';
import dummyScheduleMap from '../mocks/dummyScheduleMap.ts';

class ScheduleStore {
  private schedules = new Map<string, Schedule[]>();
  private listeners = new Map<string, Set<() => void>>();
  private globalListeners = new Set<() => void>();
  private tableIdsListeners = new Set<() => void>();
  private cachedSchedulesMap: Record<string, Schedule[]> | null = null;
  private cachedTableIds: string[] | null = null;

  private initializeFromDummy() {
    Object.entries(dummyScheduleMap).forEach(([tableId, schedules]) => {
      this.schedules.set(tableId, schedules);
    });
    this.invalidateCache();
  }
  private invalidateTableIdsCache() {
    this.cachedTableIds = null;
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

  subscribeToTableIds(callback: () => void) {
    this.tableIdsListeners.add(callback);
    return () => this.tableIdsListeners.delete(callback);
  }
  getTableIds(): string[] {
    if (!this.cachedTableIds) {
      this.cachedTableIds = Array.from(this.schedules.keys());
    }
    return this.cachedTableIds;
  }
  getTableSchedules(tableId: string) {
    return this.schedules.get(tableId) || [];
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

    this.schedules.set(newTableId, [...sourceSchedules]);

    // 캐시 무효화를 먼저!
    this.invalidateTableIdsCache();
    this.invalidateCache();

    // 그 다음 리스너에게 알림
    this.notifyTableIdsListeners();
    // this.notifyGlobalListeners(); // 전역 리스너도 알려야 함 (아직 사용 중일 수 있음)

    return newTableId;
  }

  removeTable(tableId: string) {
    this.schedules.delete(tableId);
    this.listeners.delete(tableId);

    // 캐시 무효화
    this.invalidateTableIdsCache();
    this.invalidateCache();

    // 리스너에게 알림
    this.notifyTableIdsListeners();
    this.notifyGlobalListeners(); // 전역 리스너도 알림
  }

  updateTable(tableId: string, schedules: Schedule[]) {
    this.schedules.set(tableId, schedules);
    this.invalidateCache();
    this.listeners.get(tableId)?.forEach(callback => callback());
    // this.notifyGlobalListeners(); // ← 전체 리스너에게도 알림
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

  private notifyGlobalListeners() {
    this.globalListeners.forEach(callback => callback());
  }
  private notifyTableIdsListeners() {
    this.tableIdsListeners.forEach(callback => callback());
  }
}

export const store = new ScheduleStore();
