import Component from "./utils/common";
import ListWrapper from "./component/ListWrapper";
import { breedList } from "./utils/breeds";
import { escapeFromXSS, debounce } from "./utils/common";

export default class Main extends Component {
  setup() {
    this.state = {
      breedId: undefined,
      keyword: "",
    };
  }

  template(): string {
    return `
      <div class="container mx-auto max-w-[1000px] p-2 md:px-4 md:pb-4">
        <div class="sticky top-0 flex flex-row justify-end mb-4 bg-white w-full z-10 py-2">
          <select name="filter" id="filter" class="rounded-full border border-gray-300 p-1 w-[120px] overflow-hidden text-ellipsis whitespace-nowrap mr-3 text-gray-700">
            ${breedList
              .map(
                (opt) =>
                  `<option value="${opt.id}" ${this.state.breedId === opt.id ? "selected" : ""}>${opt.name}</option>`
              )
              .join("")}
          </select>
          <div class="relative">
            <input type="text" value="${this.state.keyword}" id="search" placeholder="태그를 검색하세요." class="rounded-full border border-gray-300 py-1 pl-4 pr-8 min-w-[150px] text-gray-700">
            <img src="/icons/search.svg" alt="search" class="absolute top-3 right-4">
          </div>
        </div>
        <div data-key="listWrapper"></div>
      </div>
    `;
  }
  mounted(): void {
    new ListWrapper(document.querySelector("[data-key='listWrapper']"));
  }
  afterUpdate(): void {
    new ListWrapper(document.querySelector("[data-key='listWrapper']"), {
      ...this.state,
    });
  }

  setEvents() {
    const handleChangeFilter = async (e: Event) => {
      const target = e.target as HTMLSelectElement;
      const breedId = escapeFromXSS(target?.value) || "";
      this.setState({ ...this.state, breedId });
    };
    const handleChangeSearchInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const keyword = escapeFromXSS(target.value);
      this.setState({ ...this.state, keyword });
    };
    document
      .querySelector("#search")
      ?.addEventListener("input", debounce(handleChangeSearchInput, 2000));
    document
      .querySelector("#search")
      ?.addEventListener("change", handleChangeSearchInput);
    document
      .querySelector("#filter")
      ?.addEventListener("change", handleChangeFilter);
  }
}
