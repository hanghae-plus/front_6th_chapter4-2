# Lighthouse CI 설정 가이드

## 개요
이 프로젝트는 성능 개선 과제를 위한 Lighthouse CI가 설정되어 있습니다. Lighthouse를 통해 웹사이트의 성능을 측정하고 개선할 수 있습니다.

## 설정된 기능

### 1. GitHub Actions 자동 실행
- `main` 브랜치에 푸시할 때마다 자동으로 Lighthouse 성능 측정 실행
- 수동 실행도 가능 (Actions 탭에서 "Lighthouse CI" 워크플로우 실행)

### 2. 성능 측정 항목
- **Lighthouse 점수**: Performance, Accessibility, Best Practices, SEO, PWA
- **Core Web Vitals**: LCP, INP, CLS
- **자동 GitHub Issue 생성**: 측정 결과가 자동으로 이슈로 생성됨

### 3. 로컬 테스트
로컬에서도 Lighthouse 측정이 가능합니다.

## 사용 방법

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 프로덕션 빌드
```bash
pnpm run build
```

### 3. 로컬 서버 실행
```bash
pnpm run serve
```

### 4. Lighthouse 측정 실행
```bash
# 설정 파일 기반 실행
pnpm run lighthouse

# 또는 직접 URL 지정
pnpm run lighthouse:local
```

## 성능 기준

### Core Web Vitals 기준값
- **LCP (Largest Contentful Paint)**
  - 🟢 Good: < 2.5s
  - 🟠 Needs Improvement: < 4.0s
  - 🔴 Poor: ≥ 4.0s

- **INP (Interaction to Next Paint)**
  - 🟢 Good: < 200ms
  - 🟠 Needs Improvement: < 500ms
  - 🔴 Poor: ≥ 500ms

- **CLS (Cumulative Layout Shift)**
  - 🟢 Good: < 0.1
  - 🟠 Needs Improvement: < 0.25
  - 🔴 Poor: ≥ 0.25

### Lighthouse 점수 기준
- **Performance**: 80점 이상 (경고), 90점 이상 권장
- **Accessibility**: 90점 이상 (에러)
- **Best Practices**: 80점 이상 (경고)
- **SEO**: 80점 이상 (경고)

## 결과 확인

### 1. GitHub Actions
- Actions 탭에서 실행 결과 확인
- 자동 생성된 GitHub Issue에서 상세 결과 확인

### 2. 로컬 결과
- `.lighthouseci/` 폴더에 HTML 리포트 생성
- 브라우저에서 리포트 파일 열어서 상세 결과 확인

## 성능 개선 과제 진행 방법

1. **현재 성능 측정**: Lighthouse CI로 현재 성능 상태 파악
2. **개선 작업**: 성능 최적화 코드 작성
3. **개선 후 측정**: 다시 Lighthouse CI로 개선된 성능 측정
4. **비교 분석**: 전후 성능 비교를 통한 개선 효과 확인

## 주의사항

- Lighthouse 측정은 네트워크 상태와 서버 성능에 영향을 받을 수 있습니다
- 일관된 측정을 위해 동일한 환경에서 측정하는 것을 권장합니다
- CI 환경에서는 안정적인 측정을 위해 여러 번 측정하여 평균값을 사용합니다
