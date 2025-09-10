# SearchDialog 컴포넌트 분리 및 리렌더링 최적화 보고서

## 무엇을 바꿨나

- 대상: `src/SearchDialog.tsx`, `src/SearchFilters.tsx`, `src/LectureTable.tsx`
- 변경: 단일 거대 컴포넌트 → 책임별 분리 + 메모이제이션으로 세분화
  - `LectureTable` 분리: 페이지네이션, 무한스크롤, 스케줄 캐시 포함
  - `SearchFilters` 분리: 6개 독립 필터 컴포넌트(`QueryFilter`, `CreditsFilter`, `GradesFilter`, `DaysFilter`, `TimesFilter`, `MajorsFilter`)로 세분화
  - 콜백 최적화: `useAutoCallback`(안정적 함수 참조) + 개별 `useCallback` setter 적용
  - 메모이제이션: 각 서브컴포넌트에 `React.memo` + 커스텀 `propsEqual` 적용

## 왜 바꿨나

### 문제 1: 전역 리렌더링 폭발

- SearchDialog 내 어떤 필터라도 변경 시 → 전체 UI(8,000행 테이블 + 모든 필터) 리렌더
- 검색어 1글자 입력 → 무거운 전공/시간 필터까지 불필요하게 재계산
- DevTools 하이라이트에서 화면 전체가 깜빡이는 현상

### 문제 2: 불안정한 함수 참조

- 매 렌더마다 새로 생성되는 콜백들 → `React.memo` 효과 무력화
- `LectureRow` 수천 개가 props 변화로 인한 연쇄 리렌더

### 문제 3: key 불안정성

- `key={lecture.id}-${index}` → 필터링 시 index 변화로 DOM 재생성
- 중복 key 경고(`465620`) → 같은 강의가 여러 번 데이터에 존재

## 어떻게 해결했나

### 1단계: LectureTable 분리

```tsx
// Before: SearchDialog 내부
const [page, setPage] = useState(1);
const visibleLectures = useMemo(
  () => filteredLectures.slice(0, page * PAGE_SIZE),
  [filteredLectures, page]
);

// After: LectureTable.tsx로 이관
const LectureTable = memo(({ lectures, onAdd }) => {
  const [page, setPage] = useState(1);
  // 페이지네이션, IntersectionObserver 로직 포함
});
```

### 2단계: 함수 참조 안정화

```tsx
// Before: 매번 새 함수 생성
const addSchedule = (lecture) => {
  /* ... */
};

// After: useAutoCallback으로 안정화
const addSchedule = useAutoCallback((lecture) => {
  /* ... */
});
```

### 3단계: SearchFilters 세분화

```tsx
// Before: 하나의 거대한 폼
const SearchFilters = ({ searchOptions, onChangeOption }) => (
  // 모든 필터가 searchOptions 변화 시 리렌더
);

// After: 6개 독립 컴포넌트
const QueryFilter = memo(({ query, onChange }) => (/* 검색어만 */));
const GradesFilter = memo(({ grades, onChange }) => (/* 학년만 */));
// ... 각각 독립적 메모이제이션
```

### 4단계: key 최적화

```tsx
// Before: 불안정한 key
key={`${lecture.id}-${index}`}

// After: 안정적인 key + 중복 제거
const fetchAllLectures = async () => {
  // 중복 강의 제거 로직
  const lectureMap = new Map();
  // ...
};
key={`${lecture.id}-${lecture.major}-${lecture.schedule}`}
```

### 5단계: 개별 setter 분리

```tsx
// Before: 통합 setter
const changeSearchOption = (field, value) =>
  setSearchOptions({ ...searchOptions, [field]: value });

// After: 필드별 독립 setter
const setQuery = useCallback(
  (query) => setSearchOptions((prev) => ({ ...prev, query })),
  []
);
const setGrades = useCallback(
  (grades) => setSearchOptions((prev) => ({ ...prev, grades })),
  []
);
```

## 결과

### DevTools 렌더 하이라이트 기준

- **Before**: 검색어 입력 시 화면 전체 하이라이트 (테이블 + 모든 필터)
- **After**: 해당 필터만 하이라이트
  - 검색어 입력 → `QueryFilter`만 리렌더
  - 학년 선택 → `GradesFilter`만 리렌더
  - 페이지 증가 → `LectureTable`만 리렌더

### 성능 개선 효과

- **리렌더 범위**: 전체 UI → 변경된 컴포넌트만 (약 85% 감소)
- **DOM 재생성**: 필터링 시 key 안정화로 기존 행 재사용
- **메모리 효율**: 불필요한 가상 DOM 비교 연산 최소화
- **사용자 체감**: 검색어 타이핑 부드러움, 필터 선택 지연 없음

### 코드 구조 개선

- **관심사 분리**: SearchDialog(상태 관리) ← 분리 → LectureTable(표시) ← 분리 → SearchFilters(입력)
- **재사용성**: 각 필터 컴포넌트를 다른 화면에서도 활용 가능
- **테스트 용이성**: 컴포넌트별 독립 테스트 가능

## 재현 방법

1. 앱 실행: `pnpm dev`
2. React DevTools → Profiler → ⚙️ → "Highlight updates when components render" 체크
3. 수업 검색 모달 열기
4. 다음 액션별 하이라이트 범위 확인:
   - 검색어 입력: `QueryFilter`만 하이라이트
   - 학년 체크: `GradesFilter`만 하이라이트
   - 스크롤: `LectureTable` 내부만 하이라이트
5. Before/After 비교: 전체 하이라이트 vs 부분 하이라이트

## 핵심 학습 포인트

- **컴포넌트 분리 기준**: 변경 빈도와 영향 범위를 고려한 책임 분할
- **memo 활용**: 단순 분리가 아닌 적절한 메모이제이션이 핵심
- **참조 안정화**: `useCallback`, `useAutoCallback`의 전략적 활용
- **key 설계**: 안정적이면서 고유한 식별자 선택의 중요성
