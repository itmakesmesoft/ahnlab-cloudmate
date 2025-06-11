
<div align="center">
<h1>🐈 Catstagram (Vanila JS 프로젝트)</h1>
고양이 이미지 제공 서비스
</div>



## 소개
<strong>Catstagram</strong>은 고양이 이미지를 종류별로 필터링하거나 태그를 통해 검색할 수 있고, 게시글에 좋아요를 누르거나 제목과 태그를 작성할 수 있으며, PC뿐 아니라 모바일과 같은 다양한 기기에 대응하도록 구현하였습니다.</br>
디자인 작업은 <strong>TailwindCSS</strong>를 활용해 진행했고, <strong>Webpack</strong>을 사용하여 번들링하였습니다. 데이터베이스 구축과 호스팅은 <strong>Firebase</strong>를 통해 진행했습니다. </br>

<ins>_본 프로젝트는 SPA를 위한 별도의 라이브러리나 프레임워크의 도움을 받지 않고 순수 자바스크립트로 개발한 프로젝트입니다._<ins>

## 배포 링크

### [Catstagram](https://ahnlab-cloudmate.web.app/)

</br></br></br>

## INDEX

1. [아키텍쳐](#1-아키텍처)
2. [구현사항](#2-구현사항)
3. [빠르게 훑어보는 개발 여정](#3-빠르게-훑어보는-개발-여정)
4. [사용한 기술 스택 및 선정 이유](#4-사용한-기술-스택-및-선정-이유)
5. [고민했던 부분들](#5-고민했던-부분)
6. [트러블 슈팅](#6-트러블-슈팅)
7. [아쉬운 부분](#7-아쉬운-부분)
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

# 5. 고민했던 부분

## 재사용성과 DX에 대한 고민

프로젝트 초기부터 컴포넌트 기반으로 코드를 분리하는 것을 목표로 했습니다. 이는 코드의 재사용성을 높이고 가독성을 향상시킬 수 있기 때문입니다.

하지만 초반부터 컴포넌트 패턴 구현에 시간을 쏟다보면 나중에 기능구현에 시간에 쫒길 수 있으니, 아래와 같이 우선순위를 정하고, 추후에 리팩토링하는 것이 낫겠다 판단했습니다.

<aside>
📌

1. 기능 구현
2. 컴포넌트 패턴 도입
3. 성능 개선 및 최적화
</aside>

## 코드가 너무 난잡해

모든 엘리먼트를 `document.createElement`로 작성하다 보니 코드가 난잡해지고 가독성이 떨어지는 문제가 발생했습니다

그렇다고 해서 가독성이 좋은 문자열 형태로 html 태그 작성하고, DOM에 주입하기에는 보안적인 요소에 대한 걱정이 컸습니다. 컴포넌트 패턴을 직접 구현하신 다른 개발자분들께서는 문자열로 작성된 요소를 `innerHTML`로 주입하는 방식을 사용하지만, 이 경우 사용자 입력에 대한 이스케이핑 처리를 하지 않으면 XSS(교차 사이트 스크립팅) 공격에 노출될 위험이 있었습니다. 

저는 그래서 `document.createElement`를 보다 쉽게 간소화한 `createElement`라는 함수를 만들었습니다.

```jsx
export const createElement = (tag, props = {}, ...children) => {
  const element = document.createElement(tag);
  const properties = Object.entries({ ...props });
  if (props) {
    properties.forEach(([key, value]) => {
      if (key.slice(0, 2) === "on") {
        // onclick, onmouseover와 같은 DOM 이벤트를 addEventListener에 담기 위함
        const event = key.slice(2).toLowerCase();
        element.addEventListener(event, value);
      } else {
        element.setAttribute(key, value);
      }
    });
  }
  children.forEach((child) => {
    if (!child) return;
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  return element;
};
```

`createElement()`를 사용하면 태그 타입을 지정하고, 인자로 요소의 속성값과 이벤트 등을 객체 형태로 주입할 수 있습니다. 또한 `children`을 세 번째 인자로 children을 받아 하위 요소를 한 번에 지정할 수 있도록 했습니다.

```jsx
const submitButton = createElement("button", {onclick: () => console.log("안녕")})
```

## Webpack 도입

프로젝트에서 여러 개의 스크립트 파일을 사용하다 보니, 네트워크를 통해 개별적으로 요청해야 해 비효율적이었습니다. 그렇다고 해서 모든 코드를 하나의 스크립트 파일에 포함시키면 가독성이 떨어지고 유지보수가 어려워지는 문제가 있습니다.
웹팩은 자바스크립트 뿐만 아니라 웹서비스를 구성하는데 필요한 리소스를 모두 하나의 번들파일로 묶어 관리할 수 있다는 장점이 있어 도입하게 되었습니다.

## 결국 innerHTML을 사용해야 하나

개발을 진행하며 코드가 길어지다보니, 아무리 `createElement()`를 사용해 간단하게 엘리먼트를 만들더라도 DOM의 계층 구조를 한눈에 파악하기는 힘들다는 단점이 있었습니다.

예를 들면, `form`을 만드는 데에도 아래와 같이 필요한 코드가 많고, 복잡하게 얽혀 있어 한눈에 들어오지 않았습니다.

```jsx
const fragment = document.createDocumentFragment()
const input = createInput({
  type: "text",
  value: title,
  label: "제목",
  id: "titleInput",
});
const tagInput = createTagInput({
  tags: tags,
  label: "태그",
  id: "tagInput",
});
const submitBtn = createInput({
  type: "button",
  value: "추가",
  onclick: () => submitInfo(id),
});
const closeBtn = createInput({
  type: "button",
  value: "닫기",
  onclick: closeModal,
});
const likeBtn = createInput({
  type: "button",
  value: "Like",
  onclick: () => likePost(id),
});
const form = createElement("form", { id: "form" });
form.append(input, tagInput, submitBtn, closeBtn, likeBtn);
fragment.append(img, h3, form);
```

결국 문자열 형태로 마크업을 작성하고 DOM에 주입하는 방식을 선택하게 되었습니다. 하지만 이 과정에서 `innerHTML`의 성능 문제가 있다는 점을 간과했던 것 같습니다.

회고를 작성하는 지금에서야, `insertAdjacentHTML`로 변경하면 성능을 더욱 개선할 수 있다는 것을 알게 되었지만, 지금 변경을 시도하면 많은 부분에서 수정이 필요할 것 같아 마감 시간 안에 반영하기 어려울 것 같습니다. 그래서 아쉽게도 이 변경 사항을 적용하지 못했습니다.

[Element: insertAdjacentHTML() 메서드 - Web API | MDN](https://developer.mozilla.org/ko/docs/Web/API/Element/insertAdjacentHTML)

## 라이프사이클 도입

컴포넌트를 분리하여 개발하는 과정에서, props를 통해 데이터를 받고 이를 렌더링한 뒤 이벤트를 바인딩하기 위해 React와 유사한 라이프사이클을 설정해야 했습니다.

예를 들어, 사용자와의 상호작용을 구현하려면 렌더링 전후의 시점과 이벤트 바인딩의 타이밍을 명확히 구분해야 했습니다. 값이 업데이트되는 경우, 초기 렌더링과는 다른 동작을 구현해야 했습니다.

이를 위해 라이프사이클을 다음과 같이 나누어 진행했습니다:

<aside>
🔗

**Component 클래스 메서드**

- **setup**: 초기 설정 수행
- **render (private)**: 컴포넌트 렌더링 담당
- **mounted**: 첫 렌더링이 완료된 후 호출
- **update (private)**: 컴포넌트를 업데이트하는 내부 메서드
- **setEvents**: HTML 태그에 이벤트를 바인딩하는 메서드로, `render`가 완료된 뒤 호출
- **setState**: 컴포넌트 내부 상태를 설정하는 메서드로, 상태 변경 시 `update`가 실행
- **beforeUpdate**: 마운트 이후 첫 번째 업데이트가 실행되기 전 호출
- **afterUpdate**: 마운트 이후 업데이트가 실행되면  `render`와 `setEvents` 호출 뒤에 실행
- **unMount**: 컴포넌트가 종료되기 전 동작을 정의하기 위한 메서드
</aside>

`update` 메서드는 컴포넌트 인스턴스가 생성된 후 `setup`이 완료되면 즉시 실행되도록 하였고, 내부에서 `isMounted` 클래스 변수를 사용하여 마운트 여부에 따라 각 라이프사이클의 동작을 구분하였습니다.

```tsx
class Component {
  parent: Element | null | undefined;
  props: any;
  state: any = {};
  isMounted: boolean = false;
  
  constructor(parent?: Element | null, props?: any) {
    this.parent = parent;
    this.props = props;
    this.setup();
    this.update();
  }
  private update() {
    if (!this.isMounted) {
      this.render();
      this.setEvents();
      this.mounted();
      this.isMounted = true;
    } else {
      this.beforeUpdate();
      this.render();
      this.setEvents();
      this.afterUpdate();
    }
  }
  private render() {
    if (this.parent) {
      this.parent.innerHTML = this.template();
    }
  }
  setup() {}
  mounted() {}
  beforeUpdate() {}
  afterUpdate() {}
  **unMount**() {}
  template() {
    return ``;
  }
  setEvents() {}
  setState(newState: any) {
    if (JSON.stringify(this.state) !== JSON.stringify(newState)) {
      // 상태가 변경되었을 때만 render 호출
      this.state = { ...this.state, ...newState };
      this.update();
    }
  }
}
```

이와 별개로, `innerHTML`을 DOM에 주입하면서 발생될 수 있는 XSS 공격에 대비하기 위해 `input`값을 텍스트로 변환하여 `innerHTML`에 표시되지 않도록 처리하는 함수를 만들었습니다.

```jsx
export const escapeFromXSS= (propValue) => {
  const escaper = document.createElement("div");
  escaper.textContent = propValue;
  return escaper.innerHTML;
};

const target = document.querySelector("#input");
if (target) {
	const value = escapeFromXSS(target.value);
}
```

## API 정보 Database로 이관

기존에는 이미지를 The Cat API에서 가져오고, 이미지에 대한 정보는 별도의 Database에서 요청하는 방식으로 구현되어 있었습니다. 그러나 이러한 방식은 요청 로직이 복잡해지고, 두 번씩 요청을 해야 하는 비효율적인 문제가 있었습니다.

The Cat API가 사진 URL을 제공하는 점을 고려하여, 이 URL을 Database에 저장한 후, Database에서 이미지 정보와 사진을 동시에 불러오도록 변경하는 것이 더 효율적이라고 판단했습니다.

## 파이썬 크롤링

The Cat API의 사진 정보를 가져오기 위해 **Python**을 활용하였습니다. **requests** 라이브러리를 사용해 API 요청을 진행했으며, 데이터가 중간에 소실될 가능성을 대비해 **파일로 저장**해두었습니다.

이를 위해 The Cat API에서 제공하는 고양이 종류에 대한 **키-값 (key-value) 쌍**을 미리 받아두었고, 각 고양이 종류마다 100개의 데이터를 가져오도록 코드를 작성했습니다.

API 요청 시 한 번에 가져올 수 있는 데이터의 양이 제한되어 있었기 때문에, **각 고양이 종류별로 10번씩 요청**을 보내는 방식으로 작업을 진행했습니다. 

```python
def get_images(breed_list):
  for item in breed_list:
    result = []
    for _ in range(10):
      response = requests.get(API_HOST)
      data = response.json()
      result += data
	save_array_as_file(result)
```

---

# 6. 트러블 슈팅

## 무한 스크롤 개발 과정에서 발생한, 무한 렌더링

- **상황**
    - 컴포넌트 패턴으로 변경 후 무한스크롤을 적용하자 렌더링이 무한 반복되는 문제가 발생.
- **원인**
    - `IntersectionObserver`의 entry가 교차되면 비동기 작업(`loadImages()`)이 이루어지고, 그 결과를 setState를 이용해 저장하게 됨
    - 이때, 상태 변경이 이루어지면 다시 `render → setEvents → beforeUpdate → afterUpdate` 순으로 작업이 이루어지는데, 이떄 `IntersectionObserver`가 다시 엘리먼트를 감지하며 무한 렌더링에 빠지게 된 것.
- **해결 방법**
    - 비동기 작업의 진행 상태를 따로 두고, `isLoading` 상태가 `true`일 때, 즉 비동기 작업이 진행 중일 경우에는 비동기 함수가 호출되더라도 즉시 리턴되도록 조건을 추가하여 무한 렌더링을 방지.
        
        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2ef143a0-74da-495a-a9a6-7f1e404d2de9/13cb417b-710b-4920-a9d3-534bbabe6f47/image.png)
        

## CORS 에러

- **상황**
    - HTML 파일에서 `index.js`를 불러오려 하자 아래와 같은 CORS(Cross-Origin Resource Sharing) 에러가 발생
    - Cross origin from origin 'null' has been blocked by CORS policy
        
        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2ef143a0-74da-495a-a9a6-7f1e404d2de9/2e902ec4-a166-459c-a20f-5d52d4d46c30/image.png)
        
        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2ef143a0-74da-495a-a9a6-7f1e404d2de9/81f40ee8-200f-4370-b1b4-e10172e39f2c/image.png)
        
- **원인** :
    - type을 module로 설정한<script> 태그가 포함된 HTML 파일을 로컬에서 로드할 경우 자바스크립트 모듈 보안 요구사항으로 인해 CORS 오류가 발생
    - 로컬의 리소스를 요청할 때에는 출처(Origin)가 `null`이 되어 SOP 정책에 위배
        - Origin = 프로토콜 + 호스트 + 포트
- **해결 방법:**
    - VSCode에서 live server 확장팩 설치 후 실행하면 http 프로토콜을 통해 접근 가능
        
        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/2ef143a0-74da-495a-a9a6-7f1e404d2de9/a548cd91-92cb-48c4-b0f8-2132e4f7e886/image.png)
        
        [로컬에서 CORS policy 관련 에러가 발생하는 이유](https://takeknowledge.tistory.com/151)
        

## Firestore 페이징 처리

- **상황:**
    - Firestore에서 게시글 목록을 페이징 처리하는 기능을 구현하려 했으나, 동일한 페이지를 여러 번 불러오는 문제가 발생
    - 이로 인해 스크롤을 내릴 때 중복된 데이터가 반복해서 출력되는 현상이 나타남
        
        ```tsx
        export const getPosts = async ({
        
          page = 0,
          limitValue = 9,
        }: {
          page?: number;
          limitValue?: number;
        }) => {
          let q = query(collection(database, "cats"));
        	...
          q = query(
            q,
            startAt(page * limitValue),
            limit(limitValue)
          );
          const documentSnapshots = await getDocs(q);
        	...
        };
        ```
        
- **원인:**
    - Firestore의 `startAt`에는 문서가 들어가야 하는데, 숫자를 넣어버렸기 때문
- **해결**
    - 숫자가 아닌 마지막 문서를 기준으로 다음 페이지를 가져오는 방식으로 변경
    - `startAfter`를 사용하여 이전 페이지의 마지막 문서 이후부터 새로운 데이터를 불러오도록 처리하여 문제를 해결

---

# 7. 아쉬운 부분

### Git commit

과제 초기 단계에서 기능 구현에 집중하다 보니 Git 커밋을 적절히 진행하지 못한 점이 아쉽습니다. 다음에는 커밋 관리를 더욱 철저히 하여 코드 변경 사항을 명확히 기록하도록 하겠습니다.

### 데이터 크롤링

The Cat API에서 이미지를 크롤링할 때, 작은 사이즈의 이미지를 가져오지 못해 아쉬움이 남습니다. 이로 인해 사진 로드 시간이 길어져 사용자 경험에 부정적인 영향을 미쳤습니다. 앞으로는 이미지의 사이즈를 미리 확인하고 최적화하여 이러한 문제를 예방하도록 하겠습니다.

### DOM 처리

`innerHTML`을 사용하면 DOM 파싱이 다시 이루어져 기존에 바인딩된 이벤트가 사라지는 문제가 발생했습니다. 이로 인해 `update` 단계에서 다시 이벤트를 설정하는 `setEvents` 메서드를 컴포넌트의 라이프사이클에 구현해야 했습니다. `insertAdjacentHTML`을 활용하면 이러한 문제를 피할 수 있다는 점을 회고를 통해 깨달았습니다. 현재 시점에서 이를 수정하기에는 시간이 부족해 아쉬움이 남지만, 앞으로는 이러한 상황을 미리 고려하여 보다 효율적인 DOM 처리 방법을 적용할 수 있도록 하겠습니다.

### 보안적 측면

사용자 입력을 문자열로 변환하여 `innerHTML`로 DOM에 주입했지만, DB에 저장할 때 입력값에 대한 이스케이핑을 놓친 점이 아쉽습니다. 지금이라도 수정하고 싶지만, 마감 시간이 촉박해 반영할 수 없는 상황이 되어 아쉬움이 남습니다. 앞으로는 입력값 이스케이핑을 놓쳤더라도, Axios 인터셉터를 활용하여 데이터 전송 단계에서 필터링하는 방안을 적용해 볼 계획입니다. 이를 통해 보안을 강화하고 더욱 안전한 코드를 구현할 수 있도록 하겠습니다.
