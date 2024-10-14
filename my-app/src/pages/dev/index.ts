import Component from '../../utils/common';
import Main from '../main';

// 라우팅을 테스트하기 위한 임시 페이지
export default class Page extends Component {
  template() {
    return `
      <div class="h-[50vh] flex flex-col justify-center">
        <h1 class="text-center text-3xl">이 페이지는 기능 동작을 시현하기 위한 페이지입니다.</h1>
      </div>
      <div data-key="Main"></div>
      `;
  }
  mounted(): void {
    // 페이지가 마운트된 이후, PhotoList(리스트가 보여지는 영역) 컴포넌트 불러옴
    new Main(document.querySelector("[data-key='Main']"));
  }
}
