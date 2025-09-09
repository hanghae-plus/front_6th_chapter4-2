import dummyScheduleMap from "../dummyScheduleMap";
import { Schedule } from "../types";

type ScheduleMap = Record<string, Schedule[]>;

type Listener = () => void;

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
    this.emit();
  };

  /**
   * emit
   * 시간표 데이터 변경 시 호출되는 리스너를 실행
   */
  private emit = () => {
    this.listeners.forEach((listener) => listener());
  };
}
// 싱글톤 인스턴스 생성
export const scheduleStore = new ScheduleStore();
