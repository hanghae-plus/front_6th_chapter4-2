// 배열 비교를 위한 유틸리티 함수
const arraysEqual = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

// 객체의 특정 프로퍼티들을 비교하는 함수
export const createMemoComparison = <T extends Record<string, unknown>>(
  keys: (keyof T)[],
) => {
  return (prevProps: T, nextProps: T): boolean => {
    return keys.every((key) => {
      const prevValue = prevProps[key];
      const nextValue = nextProps[key];

      // 배열인 경우 배열 비교 함수 사용
      if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
        return arraysEqual(prevValue, nextValue);
      }

      // 함수인 경우 참조 비교
      if (typeof prevValue === 'function' && typeof nextValue === 'function') {
        return prevValue === nextValue;
      }

      // 기본값 비교
      return prevValue === nextValue;
    });
  };
};

// Lecture 객체 비교를 위한 특별한 함수
const lectureEqual = (a: unknown, b: unknown): boolean => {
  if (!a || !b) return a === b;
  if (typeof a !== 'object' || typeof b !== 'object') return a === b;

  const lectureA = a as Record<string, unknown>;
  const lectureB = b as Record<string, unknown>;

  return (
    lectureA.id === lectureB.id &&
    lectureA.grade === lectureB.grade &&
    lectureA.title === lectureB.title &&
    lectureA.credits === lectureB.credits &&
    lectureA.major === lectureB.major &&
    lectureA.schedule === lectureB.schedule
  );
};

// visibleLectures 배열 비교를 위한 특별한 함수
const visibleLecturesEqual = (a: unknown[], b: unknown[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((lecture, index) => lectureEqual(lecture, b[index]));
};

// 자주 사용되는 비교 함수들
export const searchInputComparison = createMemoComparison([
  'query',
  'credits',
  'onChange',
]);
export const gradeDayComparison = createMemoComparison([
  'grades',
  'days',
  'onChange',
]);
export const timeMajorComparison = createMemoComparison([
  'times',
  'majors',
  'allMajors',
  'onChange',
]);

// LectureRow와 LectureTable을 위한 특별한 비교 함수
export const lectureRowComparison = (
  prevProps: Record<string, unknown>,
  nextProps: Record<string, unknown>,
): boolean => {
  return (
    lectureEqual(prevProps.lecture, nextProps.lecture) &&
    prevProps.index === nextProps.index &&
    prevProps.onAddSchedule === nextProps.onAddSchedule
  );
};

export const lectureTableComparison = (
  prevProps: Record<string, unknown>,
  nextProps: Record<string, unknown>,
): boolean => {
  return (
    visibleLecturesEqual(
      prevProps.visibleLectures as unknown[],
      nextProps.visibleLectures as unknown[],
    ) && prevProps.onAddSchedule === nextProps.onAddSchedule
  );
};
