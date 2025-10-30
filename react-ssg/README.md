# React SSG (Static Site Generation)

이 프로젝트는 **빌드 시점에 HTML을 미리 생성**하는 SSG 방식을 사용합니다.

## SSG vs SSR 차이점

### SSG (이 프로젝트)
- ✅ **빌드 시점**에 HTML 생성
- ✅ 정적 파일로 서빙 (CDN 배포 가능)
- ✅ 매우 빠른 응답 속도
- ❌ 데이터 업데이트 시 재빌드 필요

### SSR (react-hybrid)
- ✅ **요청 시점**에 HTML 생성
- ✅ 최신 데이터 즉시 반영
- ❌ Express 서버 필요
- ❌ 매 요청마다 렌더링 비용 발생

## 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 빌드 (빌드 시점에 모든 HTML 생성!)
npm run build

# 3. 정적 서버 실행
npm start
```

## 빌드 과정

1. **클라이언트 빌드**: React 앱을 번들링
2. **SSG 빌드**: 각 페이지의 HTML을 미리 생성
   - 영화 목록 API 호출
   - `renderToString()`으로 React를 HTML로 변환
   - `dist/` 폴더에 정적 HTML 파일 저장

## 핵심 차이: 언제 HTML이 생성되는가?

- **SSG**: `npm run build` 실행 시 (빌드 타임)
- **SSR**: 사용자가 페이지 요청 시 (런타임)
