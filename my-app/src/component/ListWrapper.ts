import Modal from "./Modal";
import Rendering from "./Rendering";
import Component from "../utils/common";
import { throttle } from "../utils/common";
import { getPost, getPosts, ImageDataInterface } from "../utils/firebase";

const styles = {
  listItem:
    "relative rounded-md md:rounded-lg lg:rounded-xl w-full h-auto aspect-[1/1] overflow-hidden hover:shadow-xl cursor-pointer",
  listItemHover:
    "before:hover:block before:hover:absolute before:hover:top-0 before:hover:left-0 before:hover:w-full before:hover:h-full before:hover:bg-white/15",
  listItemActive: "before:active:shadow-none before:active:bg-black/20",
};

class ListWrapper extends Component {
  observer: IntersectionObserver | undefined;
  setup() {
    this.state = {
      images: [],
      breedId: this.props?.breedId,
      keyword: this.props?.keyword,
      modal: [],
      isLoading: false,
      isEnded: false,
    };
  }

  async mounted(): Promise<void> {
    await this.loadImages({
      breedId: this.state.breedId,
      keyword: this.state.keyword,
    });

    this.observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          const { breedId, keyword } = this.state;
          this.loadImages({
            breedId: breedId,
            keyword: keyword,
          });
        }
      },
      { threshold: 0.5 }
    );
    this.observeFooter();
  }
  observeFooter() {
    return throttle(() => {
      const footer = document.querySelector("#footer");
      if (footer) this.observer?.observe(footer);
      new Rendering(document.querySelector("[data-key='rendering']"));
    }, 2000)();
  }

  async loadImages(props: { breedId?: string; keyword?: string }) {
    if (this.state.isLoading) return;
    this.setState({ ...this.state, isLoading: true });
    const images = await getPosts({ ...props });
    if (images) {
      const isEnded = images.length === 0 ? true : false;
      return this.setState({
        ...this.state,
        isLoading: false,
        isEnded,
        images: [...this.state.images, ...images],
      });
    }
  }

  async renderModal(id: string) {
    const modalRoot = document.querySelector("#modalRoot");
    const info = await getPost(id);
    if (modalRoot) {
      this.state.modal.push(new Modal(modalRoot, { ...info, id }));
    }
  }

  closeModal() {
    this.state.modal[0].unmount();
    this.state.modal.pop();
  }

  template(): string {
    return `
      <div>
      ${
        !this.isMounted
          ? "<div data-key='rendering'></div>"
          : `<ul class="list_wrapper grid grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        ${this.state?.images
          ?.map(
            (image: ImageDataInterface) => `
            <li class="${styles.listItem} ${styles.listItemHover} ${styles.listItemActive}" data-id="${image.id}">
              <img src="${image.url}" alt="이미지" class="w-full h-auto aspect-[1/1] object-cover object-center">

            </li>`
          )
          .join("")}
          </ul>`
      }
        ${this.state?.images.length === 0 ? "<div class='w-full text-center py-40 bg-gray-50 text-gray-500 rounded-xl'>검색 결과 없음</div>" : ""}
        <footer id="footer" class="w-full h-[100px] flex flex-col justify-center items-center">
        ${
          this.isMounted && this.state.isLoading
            ? `<span class="loader w-8 h-8"></span>`
            : ""
        }
        </footer>
      </div>
    `;
  }

  setEvents() {
    const handleClickList = (e: Event) => {
      const target = e.target as Element;
      const closest = target.closest("[data-id]") as HTMLLIElement; // closest()는 루트 방향으로 탐색
      if (!closest) return;
      const id = closest.dataset.id;
      id && this.renderModal(id);
    };

    document
      .querySelector(".list_wrapper")
      ?.addEventListener("click", handleClickList);

    if (!this.state.isEnded) this.observeFooter();
  }
}

export default ListWrapper;
