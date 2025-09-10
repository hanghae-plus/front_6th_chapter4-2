# SearchDialog 강의 테이블 행 메모화 최적화 보고서

## 무엇을 바꿨나

- 대상: `src/SearchDialog.tsx`
- 변경: 강의 테이블 인라인 렌더링을 메모화된 컴포넌트로 분리
  - `LectureRow` 컴포넌트를 `React.memo`로 감싸서 개별 강의 행 메모화
  - `addSchedule` 함수를 `useCallback`으로 안정화하여 참조 일관성 확보
  - `key`에서 `index` 제거하여 `lecture.id`만 사용

## 왜 바꿨나

- 무한스크롤로 페이지 추가 시 모든 기존 강의 행이 재렌더되는 문제 해결
- 페이지가 늘어날수록 누적되는 렌더링 비용 증가 방지(3000개 강의 시 600ms+ 소요)
- 신규 추가되는 강의 행만 렌더링하여 사용자 경험 개선

## 결과(React Profiler 기준)

- Before: 67.9ms → 84.3ms (누적 증가 패턴)
- After: 31.7ms → 25.4ms (일정 유지 패턴)
- 핵심 개선: 페이지 누적 증가 방지로 대량 데이터에서 극적 성능 향상

참고 프로파일링 결과

- Before: 페이지 추가마다 전체 테이블 리렌더 (누적 시간 증가)
- After: 신규 강의 행만 렌더, 기존 행은 memo로 보호
- After 세부 컴포넌트 렌더링: `td`, `button`, `Anon` 등 개별 컴포넌트만 표시

## 재현 방법

1. 앱 실행: `pnpm dev`
2. 수업 검색 모달 열기
3. React DevTools Profiler 탭에서 Record 시작
4. 무한스크롤로 여러 페이지 추가
5. Record 중지 후 렌더링 시간과 컴포넌트 변화 확인
   - Before: SearchDialog 전체 시간 증가 추세
   - After: 신규 컴포넌트만 렌더, 시간 일정 유지

## 코드 스니펫

```ts
// 메모화된 강의 테이블 행 컴포넌트
const LectureRow = memo(
  ({
    lecture,
    onAdd,
  }: {
    lecture: Lecture;
    onAdd: (lecture: Lecture) => void;
  }) => (
    <Tr>
      <Td width="100px">{lecture.id}</Td>
      <Td width="50px">{lecture.grade}</Td>
      <Td width="200px">{lecture.title}</Td>
      <Td width="50px">{lecture.credits}</Td>
      <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
      <Td
        width="150px"
        dangerouslySetInnerHTML={{ __html: lecture.schedule }}
      />
      <Td width="80px">
        <Button size="sm" colorScheme="green" onClick={() => onAdd(lecture)}>
          추가
        </Button>
      </Td>
    </Tr>
  )
);

// 안정화된 addSchedule 함수
const addSchedule = useCallback(
  (lecture: Lecture) => {
    if (!searchInfo) return;
    const { tableId } = searchInfo;
    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));
    onClose();
  },
  [searchInfo, setSchedulesMap, onClose]
);

// 메모화된 컴포넌트 사용
{
  visibleLectures.map((lecture) => (
    <LectureRow key={lecture.id} lecture={lecture} onAdd={addSchedule} />
  ));
}
```

## 성능 개선 원리

### 객체 참조 안정성

- `lecture` 객체: 원본 배열에서 나온 안정적인 참조값
- 페이지네이션 시 기존 강의 객체는 동일한 참조 유지

### useCallback 의존성 안정성

- `searchInfo`: 모달 열릴 때만 변경 (드물음)
- `setSchedulesMap`: Context 함수로 안정적
- `onClose`: props 함수로 안정적

### 메모화 효과

- 기존 강의 행: props 변경 없음 → memo에 의해 리렌더 방지
- 신규 강의 행: 새로운 props → 정상 렌더링
- 결과: 페이지 추가 시 신규 행만 렌더링

## 적용 효과

### 성능 지표

- **시간 증가 패턴**: 누적 증가 → 일정 유지
- **메모리 효율성**: 불필요한 DOM 조작 제거

### 사용자 경험

- **스크롤 부드러움**: 페이지 추가 시 끊김 현상 완화
- **반응성 향상**: 대량 데이터에서도 일관된 성능
- **배터리 절약**: CPU 사용량 감소로 모바일 환경 개선

## 적용 조건

- **데이터 특성**: 불변 객체 배열 (API에서 가져온 강의 데이터)
- **사용 패턴**: 무한스크롤 페이지네이션이 있는 리스트
- **컴포넌트 구조**: props가 안정적으로 유지 가능한 경우
- **성능 요구**: 대량 데이터 렌더링 최적화가 필요한 경우
