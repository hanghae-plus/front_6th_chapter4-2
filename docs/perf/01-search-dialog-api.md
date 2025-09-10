# SearchDialog API 로딩 최적화 보고서

## 무엇을 바꿨나

- 대상: `src/SearchDialog.tsx`
- 변경: 전공/교양 JSON 호출을 직렬·중복(6회) → 병렬·1회(2회)로 수정
  - `Promise.all([fetchMajors(), fetchLiberalArts()])`로 동시 시작
  - `setLectures([...majors.data, ...liberal.data])`로 합친 뒤 상태 반영

## 왜 바꿨나

- 독립된 두 데이터를 굳이 순서대로 기다릴 필요가 없음 → 병렬 처리 시 초기 표시가 빨라짐
- 동일 리소스를 여러 번 요청(200/304 포함)하는 낭비 제거

## 결과(콘솔 로그 기준)

- Before: 146 ms (직렬 + 6회 호출)
- After: 56.8 ms(병렬 + 2회 호출)
- 개선폭: 약 61% 감소

참고 로그 예시

- Before: `API 호출에 걸린 시간(ms): 146.9`
- After: `API 호출에 걸린 시간(ms): 56.8`, `72.3`
- After 시작 로그가 서로 거의 동시에 출력됨: `API Call majors start`, `API Call liberal-arts start`

## 재현 방법

1. 앱 실행: `pnpm dev`
2. 모달 열기 전/후 관계없이 콘솔 탭에서 타임스탬프 확인
3. 새로고침 후 Network 탭 필터 `schedules-*.json` 확인
   - Before: majors/liberal-arts가 다회(일부 304)로 찍힘
   - After: 각 1회씩 총 2건

## 코드 스니펫

```ts
const fetchAllLectures = async (): Promise<Lecture[]> => {
  console.log("API Call majors start", performance.now());
  const majorsPromise = fetchMajors();
  console.log("API Call liberal-arts start", performance.now());
  const liberalPromise = fetchLiberalArts();
  const [majorsRes, liberalRes] = await Promise.all([
    majorsPromise,
    liberalPromise,
  ]);
  return [...majorsRes.data, ...liberalRes.data];
};
```
