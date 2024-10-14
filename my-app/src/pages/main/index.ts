import Component from '../../utils/common';
import PhotoList from './components/PhotoList/PhotoList';
import { breedList } from '../../utils/breeds';
import { escapeFromXSS, debounce } from '../../utils/common';

interface PropsInterface {
  isDevMode: boolean;
}
interface StateInterface {
  breedId: string | undefined;
  keyword: string;
}

// 메인 페이지 컴포넌트
export default class Main extends Component<PropsInterface, StateInterface> {
  isDevMode: boolean = false;
  setup() {
    this.state = {
      breedId: undefined,
      keyword: '',
    };
    if (this.props?.isDevMode) {
      this.isDevMode = this.props.isDevMode;
    }
  }

  template(): string {
    return `
      <div class="container mx-auto max-w-[1000px] px-2 pb-2 md:px-4 md:pb-4">
        <div class="sticky top-0 flex flex-row justify-end mb-4 bg-white w-full z-10 py-2">
          <select name="filter" id="filter" class="rounded-full border border-gray-300 p-1 w-[120px] overflow-hidden text-ellipsis whitespace-nowrap mr-3 text-gray-700">
          ${breedList
            .map(
              (opt) => `
            <option value="${opt.id}" ${this.state.breedId === opt.id ? 'selected' : ''}>${opt.name}</option>`
            )
            .join('')}
          </select>
          <div class="relative">
            <input type="text" value="${this.state.keyword}" id="search" placeholder="태그를 검색하세요." class="rounded-full border border-gray-300 py-1 pl-4 pr-8 min-w-[150px] text-gray-700">
            <img src="/icons/search.svg" alt="search" class="absolute top-3 right-4">
          </div>
        </div>
        <div data-key="PhotoList"></div>
      </div>
    `;
  }
  mounted(): void {
    // 페이지가 마운트된 이후, PhotoList(리스트가 보여지는 영역) 컴포넌트 불러옴
    new PhotoList(document.querySelector("[data-key='PhotoList']"));
  }
  afterUpdate(): void {
    // 업데이트가 될 때마다 PhotoList에 상태 값을 전달하여 다시 렌더링
    new PhotoList(document.querySelector("[data-key='PhotoList']"), {
      ...this.state,
    });
  }
  async handleChangeFilter(e: Event) {
    const target = e.target as HTMLSelectElement;
    const breedId = escapeFromXSS(target?.value) || '';
    this.setState({ ...this.state, breedId });
  }
  handleChangeSearchInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const keyword = escapeFromXSS(target.value);
    this.setState({ ...this.state, keyword });
  }
  setEvents() {
    // 필터 변경 핸들러
    document
      .querySelector('#search')
      ?.addEventListener(
        'input',
        debounce(this.handleChangeSearchInput.bind(this), 2000)
      );
    document
      .querySelector('#search')
      ?.addEventListener('change', this.handleChangeSearchInput.bind(this));
    document
      .querySelector('#filter')
      ?.addEventListener('change', this.handleChangeFilter.bind(this));
  }
}
