import { AxiosResponse } from "axios";

export const fill2 = (n: number) => `0${n}`.substr(-2);

export const parseHnM = (current: number) => {
  const date = new Date(current);

  return `${fill2(date.getHours())}:${fill2(date.getMinutes())}`;
};

const getTimeRange = (value: string): number[] => {
  const [start, end] = value.split("~").map(Number);

  if (end === undefined) return [start];

  return Array(end - start + 1)
    .fill(start)
    .map((v, k) => v + k);
};

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

export const createCachedFetcher = <T>(
  fetchFn: () => Promise<AxiosResponse<T>>
) => {
  let cache: Promise<AxiosResponse<T>> | null = null;

  return (): Promise<AxiosResponse<T>> => {
    if (cache) {
      console.log("캐시 사용");
      return cache;
    }

    console.log("새로운 Promise 생성");
    cache = fetchFn();

    return cache;
  };
};

export function collectMatchingUpTo<T>(
  items: T[],
  matches: (item: T) => boolean,
  maxCount: number
): T[] {
  const result: T[] = [];

  for (let i = 0; i < items.length && result.length < maxCount; i++) {
    if (matches(items[i])) result.push(items[i]);
  }

  return result;
}
