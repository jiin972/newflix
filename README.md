# Newflix

- React, TypeScript, framer motion 를 이용한 영화 및 TV Show 스트리밍 서비스 클론 프로젝트

---

### 🌏 프로젝트 링크

[Newflix 바로가기](https://newflixclone.netlify.app)

서버 실행 코드

- npm run dev

---

### 개발환경

- 언어: Javascript(es6), TypeScript
- 프론트: React
- 배포: netlify
- 라이브러리: npm, react-query, React-hook-form, styled-components, framer-motion..

---

### 프로젝트 구조

📂[src]
|--📂[Api] - 공용/movie/tv/search Api 폴더
|--📂[assets/image] - 빈 포스터 대체용 이미지 폴더
|--📂[Components] - 리액트 컴포넌트 폴더
| |--📂[MoviePart] - 영화 Banner, Slider, Modal 컴포넌트 폴더
| |--📂[TvshowPart] - Tv시리즈 Banner, Slider, Modal 컴포넌트 폴더
|--Footer.tsx - 푸터 컴포넌트
|--Header.tsx - 헤더 컴포넌트(페이지 이동 및 검색 담당)
| |--📂[Routes] - Movie, Tvshow, Search 라우터 폴더
|--App.tsx - 컴포넌트 관계 정의(Router v6로 작성)
|--main.tsx - 메인 컴포넌트
|--styled.d.ts - 컬러 변수 설정
|--theme.ts - 컬러 설정
|--utils.ts - 이미지 경로 생성 함수

---

### 🥵 개선된 버그

- slider에 window.outerWidth 정의로 애니메이션 구현시 방향,, 부재로 애니메이션 엉킴
  - 필요에 의해, direction정의(variants내 정의 및 아래와 같이 사용)
    - useState 정의
    - 컴포넌트에 custom prop사용(animatePresence, framer-motion=>prop, key제공)
- api.ts리팩토링
- react-hook-form을 이용해 form처리(validation 등 )개선 및 search로직 구현(multi)

---

### 🥲 개선되어야 할 버그

##### 배포이전

- Modal box 퇴장 시 exit애니메이션 부재(추후 수정예정)
- ~~layoutId 적용 시 발생한 애니메이션 꼬임 처리~~ (포기함)
- 🔥peek effect 적용해 보기(슬라이더)

##### 배포이후

- 25. 10. 23.(첫 배포)
  - footer 관련 movie/tvshow에서의 화면 크기에 따른 위치수정 필요 (수정완료)
  - 검색된 이미지들의 화면 배치를 슬라이더와 동일하게 하는 방향으로 (수정완료, 타이틀 적용)
  - 텐키리스 키보드가 필요함.
