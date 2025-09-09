import dummyScheduleMap from "../dummyScheduleMap";
import { Schedule } from "../types";

type ScheduleMap = Record<string, Schedule[]>;

// emit할 때 어떤 테이블이 바뀌었는지 알려주기
type Listener = (changedId: string) => void;

/**
 * ScheduleStore
 * 시간표 데이터를 관리하는 스토어
 */
class ScheduleStore {
  private schedulesMap: ScheduleMap = dummyScheduleMap;
  private listeners = new Set<Listener>();

  /**
   * subscribe
   * 시간표 데이터 변경 시 호출되는 리스너를 등록
   * @param listener 리스너
   * @returns 해제 함수
   */
  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener); // unsubscribe
  };

  /**
   * getScheduleMap
   * 시간표 데이터를 반환
   * @returns 시간표 데이터
   */
  getScheduleMap = () => this.schedulesMap;

  /**
   * setScheduleMap
   * 시간표 데이터를 업데이트
   * @param next 업데이트 함수
   */
  setScheduleMap = (
    next: ScheduleMap | ((prev: ScheduleMap) => ScheduleMap) // ✅ 두 가지 다 허용
  ) => {
    if (typeof next === "function") {
      this.schedulesMap = (next as (prev: ScheduleMap) => ScheduleMap)(
        this.schedulesMap
      );
    } else {
      this.schedulesMap = next;
    }
    this.emit("*");
  };

  /**
   * setTable
   * 특정 tableId만 업데이트
   */
  setTable = (
    tableId: string,
    next: Schedule[] | ((prev: Schedule[]) => Schedule[])
  ) => {
    const prevTable = this.schedulesMap[tableId] ?? [];
    const newTable = typeof next === "function" ? next(prevTable) : next;

    // 전체 객체 새로 만들지 말고, 해당 테이블만 교체
    this.schedulesMap[tableId] = newTable;
    this.emit(tableId);
  };

  /**
   * deleteTable
   * 특정 tableId만 삭제
   */
  deleteTable = (tableId: string) => {
    const copy = { ...this.schedulesMap };
    delete copy[tableId];
    this.schedulesMap = copy;
    this.emit(tableId);
  };

  /**
   * duplicateTable
   * 특정 tableId만 복제
   */
  duplicateTable = (tableId: string) => {
    const copy = { ...this.schedulesMap };
    copy[`${tableId}-${Date.now()}`] = [...copy[tableId]];
    this.schedulesMap = copy;
    this.emit(tableId);
  };

  /**
   * deleteScheduleItem
   */
  deleteScheduleItem = (tableId: string, data: Schedule) => {
    this.schedulesMap[tableId] = this.schedulesMap[tableId].filter(
      (schedule) =>
        schedule.day !== data.day || !schedule.range.includes(data.range[0])
    );
    this.emit(tableId);
  };

  /**
   * emit
   * 시간표 데이터 변경 시 호출되는 리스너 실행
   */
  private emit = (changedId: string) => {
    this.listeners.forEach((listener) => listener(changedId));
  };
}
// 싱글톤 인스턴스 생성
export const scheduleStore = new ScheduleStore();
