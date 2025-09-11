/**
 * 시간표 관련 유틸리티 함수들
 */

// 숫자를 2자리 문자열로 변환 (ex: 9 -> "09")
export const fill2 = (n: number) => `0${n}`.substr(-2);

// 밀리초를 시:분 형식으로 변환
export const parseHnM = (current: number) => {
  const date = new Date(current);
  return `${fill2(date.getHours())}:${fill2(date.getMinutes())}`;
};

// 시간 범위 문자열을 숫자 배열로 변환 (ex: "1~3" -> [1, 2, 3])
const getTimeRange = (value: string): number[] => {
  const [start, end] = value.split("~").map(Number);
  if (end === undefined) return [start];
  return Array(end - start + 1)
    .fill(start)
    .map((v, k) => v + k);
};

// 스케줄 문자열을 파싱하여 요일, 시간, 강의실 정보로 분리
export const parseSchedule = (schedule: string) => {
  const schedules = schedule.split("<p>");
  return schedules.map((schedule) => {
    const reg = /^([가-힣])(\d+(~\d+)?)(.*)/;

    const [day] = schedule.split(/(\d+)/);

    const range = getTimeRange(schedule.replace(reg, "$2"));

    const room = schedule.replace(reg, "$4")?.replace(/\(|\)/g, "");

    return { day, range, room };
  });
};
