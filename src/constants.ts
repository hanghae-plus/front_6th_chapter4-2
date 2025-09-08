/**
 * 시간표에서 사용되는 상수 정의
 */

// 요일 라벨 배열
export const DAY_LABELS = ["월", "화", "수", "목", "금", "토"] as const;

// 시간표 셀 크기 설정
export const CellSize = {
  WIDTH: 80,
  HEIGHT: 30,
};

// 시간 단위 변환 상수
export const 초 = 1000;
export const 분 = 60 * 초;
