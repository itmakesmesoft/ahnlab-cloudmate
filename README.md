
<div align="center">
<h1>🐈 Catstagram</h1>
<b>for Ahnlab Cloudmate</b></br>
고양이 이미지 제공 서비스
</div>



## 소개

<strong>Catstagram</strong>은 고양이 이미지를 종류별로 필터링하거나 태그를 통해 검색할 수 있고, 게시글에 좋아요를 누르거나 제목과 태그를 작성할 수 있으며, PC뿐 아니라 모바일과 같은 다양한 기기에 대응하도록 구현하였습니다.</br>
디자인 작업은 <strong>TailwindCSS</strong>를 활용해 진행했고, <strong>Webpack</strong>을 사용하여 번들링하였습니다. 데이터베이스 구축과 호스팅은 <strong>Firebase</strong>를 통해 진행했습니다.

## 배포 링크

### [Catstagram](https://ahnlab-cloudmate.web.app/)

</br></br></br>

## INDEX

1. [아키텍쳐](#1-아키텍처)
2. [구현사항](#2-구현사항)
3. [빠르게 훑어보는 개발 여정](#3-빠르게-훑어보는-개발-여정)
4. [사용한 기술 스택 및 선정 이유](#4-사용한-기술-스택-및-선정-이유)
5. [고민했던 부분들](#5-7-고민했던-부분-아쉬운-부분-트러블-슈팅)
6. [아쉬운 부분](#5-7-고민했던-부분-아쉬운-부분-트러블-슈팅)
7. [트러블 슈팅](#5-7-고민했던-부분-아쉬운-부분-트러블-슈팅)
   </br></br>

---

# 1. 아키텍처

### 프로젝트 아키텍처

![아키텍쳐](https://github.com/user-attachments/assets/259c1d7f-4ec5-46f2-a923-929c6c1a0b7b)

### 폴더 구조

```go
/my-app
  /dist
  /public
    /icons
    - index.html
  /src
    /pages
      /index.ts
      /components
    /components
    /utils
    - index.ts
    - index.css
/python   // 데이터 크롤링 및 Firebase 관리용
```

</br>
</br>

# 2. 구현사항

### 무한스크롤

- IntersectionObserverAPI를 이용한 무한 스크롤 구현
- footer에 50% 만큼 교차하는 경우 데이터 패치 요청
  </br></br>
  ![무한스크롤](https://github.com/user-attachments/assets/e3a15981-8c2c-4037-8c9a-b35805845b84)

### 모달 구현

- 이미지 클릭 시 해당 이미지의 상세 정보 표시
- 모달 우측 상단 X 버튼 또는 모달 바깥 클릭 시 모달 닫기 구현</br></br>
  ![모달 클릭](https://github.com/user-attachments/assets/b245f207-4691-49a4-bcd3-7ada4108cf10)
  ![모달 끄기](https://github.com/user-attachments/assets/a37f9451-ee60-49d1-ae63-a5f12783f09b)

### 로딩 스피너 및 스켈레톤 UI

- 페이지를 첫 렌더링하기 이전, 비동기적으로 데이터를 불러오는 시점에 스켈레톤 UI 표시
- 페이지를 마운트 한 이후, 비동기적으로 데이터를 불러오는 시점에 사용자에게 로딩 스피너 표시</br></br>
  ![스켈레톤 ui](https://github.com/user-attachments/assets/9a1fe05a-ce1c-4b57-a142-17bb4c70c507)

### Debounce, Throttle 적용

- 검색창에 태그를 입력한 후 엔터를 누르지 않고 2초간 입력이 없을 경우, 검색 결과를 표시하도록 디바운스 적용
- 무한 스크롤 시 첫 번째 요청만 수행되며, 200ms 이내에 추가 요청은 무시되도록 쓰로틀링 적용</br></br>
  ![디바운싱](https://github.com/user-attachments/assets/f3d831ff-e32b-415f-bdcf-4e7bcb762a06)

### 태그 검색 및 필터링 기능

- python을 이용해 TheCatAPI의 데이터를 크롤링한 뒤, firestore에 태그 및 제목 등의 정보와 함께 저장
- 태그를 통해 고양이 이미지를 검색하거나, 고양이 종류를 통해 필터링이 가능</br></br>
  ![태그 인풋](https://github.com/user-attachments/assets/86b6aa66-f5a9-4c39-8552-0254a43bb4ce)

### 좋아요

- 각 이미지에 좋아요 표시 기능
- firestore를 이용하여 게시글에 좋아요를 눌렀는지 여부와 좋아요 수를 카운트하는 필드를 만들고 이미지 정보를 불러올 때 함께 반환하도록 설계
- 좋아요가 DB에 반영되는 동안 로딩 스피너가 표시되도록 구현</br></br>
  ![좋아요 기능](https://github.com/user-attachments/assets/26ee68b6-a4ed-4133-9170-05b899ce895d)

### 게시글 수정

- firebase를 통해 게시글의 제목, 태그 정보를 저장하도록 구현
- 태그 Input을 제작하여 손쉽게 태그 추가하도록 구현</br></br>
  ![게시글 수정 기능](https://github.com/user-attachments/assets/aa52bbc3-8746-479f-98f3-99b50da8c972)

### Firebase 데이터베이스

- 이미지를 관리하고 검색 및 태그 필터링 처리</br></br>
  <img width="491" alt="스크린샷 2024-10-14 225318" src="https://github.com/user-attachments/assets/fe2bc591-d234-4f30-8617-27d89b52bc18">

### 컴포넌트 기반 아키텍처 설계, 라이프사이클 및 라우팅 구현

- 코드의 재사용성 및 유지보수성을 극대화
- 라이프사이클에 따른 동작 처리 가능 [코드 보기](https://github.com/itmakesmesoft/ahnlab-cloudmate/blob/5435525c076d05db9000c0a316a3537d446c716a/my-app/src/utils/common.ts#L8)
- 페이지 전환 시 서버로부터 새로운 페이지를 로드하지 않고, 자바스크립트를 이용하여 동적으로 컨텐츠를 교체
- URL의 변화에 따라 적절한 컴포넌트를 렌더링 [코드 보기](https://github.com/itmakesmesoft/ahnlab-cloudmate/blob/5435525c076d05db9000c0a316a3537d446c716a/my-app/src/utils/router.ts)

</br>
</br>

# 3. 빠르게 훑어보는 개발 여정

### 1. 개발 우선 순위 설정

- 프로젝트의 핵심 목표와 필요한 기능들을 정리하고, 우선순위를 설정했습니다.

### 2. 기능 구현

- 이미지 리스트: 고양이 이미지 리스트를 생성하고, 필터링 및 검색 기능을 추가했습니다.
- 모달: 이미지를 클릭하면 상세 정보를 확인할 수 있는 모달 창을 구현했습니다.
- 무한 스크롤: 사용자가 스크롤을 내릴 때마다 더 많은 이미지를 로드할 수 있도록 무한 스크롤을 적용했습니다.

### 3. Firebase DB 구축

- Firebase를 이용해 데이터베이스를 구축하고, 고양이 이미지 데이터를 필터링하거나 태그를 통해 검색할 수 있는 기능을 추가했습니다.

### 4. TypeScript, TailwindCSS 및 Webpack 번들링 도입

- 타입 안정성을 위해 TypeScript를 도입하였고, Webpack을 통해 프로젝트를 번들링했습니다.
- 개발 생산성을 높이기 위해 TailwindCSS를 도입하였고, 이를 config에 반영하였습니다.
- 이 과정에서 Webpack dev server를 통해 실시간으로 작업이 반영되도록 하여 개발 효율성을 향상시켰습니다.

### 5. 클래스형 컴포넌트 패턴 도입

- 초반에는 함수형 컴포넌트 구현을 시도했으나, 이 경우 매 컴포넌트마다 불필요한 코드가 많아지는 단점이 있어, 클래스형 컴포넌트를 구현하는 것으로 방향을 선회했습니다.
- 이 과정에서 리액트와 비슷한 라이프 사이클과 페이지 라우팅을 구현하였습니다.

### 6. 프로젝트 구조 개선

React와 비슷한 폴더 구조를 사용해 컴포넌트를 분리하고 구조화하였습니다.

### 7. 디자인 작업

피그마를 통해 디자인 시안을 제작하였고, TailwindCSS를 도입하여, 디자인을 적용하였습니다. [피그마 바로가기]

### 8. 리팩토링

이후에는 자주 사용되는 UI 컴포넌트를 분리하여 코드의 가독성을 높이고, BottleNeck 함수를 개선하는 등의 작업을 진행했습니다.

</br>
</br>

# 4. 사용한 기술 스택 및 선정 이유

### TypeScript

초반에 자바스크립트로 개발하다보니, 타입이 동적으로 결정되면서 의도치않은 오류가 발생하였습니다. 이는 빌드과정에서는 보이지 않고, 실제 테스트를 해봐야지만 알 수 있었습니다. 이러한 동적으로 결정되는 타입으로 인한 오류를 줄이기 위해 TypeScript를 도입했습니다. TypeScript는 안정적인 코드 작성을 가능하게 하며 사전 오류 예방에 큰 장점을 가지고 있습니다.

### Webpack, loader, Dev Server

컴포넌트를 모듈 단위로 분리하는 과정에서 효율적인 HTTP 요청을 위해 하나의 번들 파일로 묶어야 했습니다. 이를 위해 가장 널리 사용되는 모듈 번들러인 Webpack을 도입했습니다.
Webpack은 기본적으로 JavaScript와 JSON 파일만 번들링하므로, 다른 형식의 파일도 포함하기 위해 로더를 사용했습니다.
개발 진행 상황을 확인하기 위해 매번 서버를 재시작해야 하는 불편함이 있었는데, 이를 해결하기 위해 webpack-dev-server를 설치했습니다. 이로 인해 코드 변경 사항이 실시간으로 반영되어 생산성이 크게 향상되었습니다.

### TailwindCSS

스타일링을 위해 별도의 CSS 파일을 관리하는 것에 번거로움을 느껴 TailwindCSS을 도입하였습니다. 이를 통해 기존에 CSS 파일과 스크립트 파일을 오가며 코드를 작성할 필요 없이 유틸리티 클래스를 사용하여 빠르고 쉽게 스타일링할 수 있게 되었습니다.

### Firebase

게시글의 CRUD 기능을 구현하기 위해 Firebase를 통해 DB를 구축했습니다. 초기에는 TheCatAPI와 Firebase를 함께 사용하여, 이미지 정보는 CatAPI에서, 제목과 태그와 같은 게시글 정보는 Firebase에서 불러오는 구조로 설정했습니다.
하지만 로직이 복잡해지고 렌더링 시 두 번의 요청이 발생해 비효율적이라고 판단하였고, 이미지 정보를 크롤링하여 Firebase DB로 통합하여 관리하기로 결정했습니다.

### Prettier, ESLint

코드 스타일 통일을 위해 Prettier를 사용하였고, ESLint를 통해 문법적 오류를 검출했습니다.

</br></br>

# 5-7. 고민했던 부분, 아쉬운 부분, 트러블 슈팅

아래 링크로 이동하시면 자세한 과제 후기를 보실 수 있습니다.

### [노션 링크](https://itmakesmesoft.notion.site/118dbad75ce680d9b38cf36911afe90e?pvs=4)
