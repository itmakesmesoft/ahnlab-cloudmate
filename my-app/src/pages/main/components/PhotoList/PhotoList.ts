import Modal from '../Modal/Modal';
import Skeleton from '../Skeleton';
import Component, { throttle } from '../../../../utils/common';
import {
  getPost,
  getPosts,
  ImageDataInterface,
} from '../../../../utils/firebase';

interface PropsInterface {
  breedId: string;
  keyword: string;
}
interface StateInterface {
  images: ImageDataInterface[];
  breedId: string;
  keyword: string;
  modal: Component[];
  isLoading: boolean;
  isEnded: boolean;
}

class PhotoList extends Component<PropsInterface, StateInterface> {
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

  template(): string {
    const { images, isLoading } = this.state;
    return !this.isMounted
      ? Skeleton()
      : `<ul class="list_wrapper grid grid-cols-3 gap-2 md:gap-3 lg:gap-4">
      ${images
        ?.map(
          (image: ImageDataInterface) => `
          <li data-id="${image.id}" class="${styles.listItem} ${styles.listItemHover} ${styles.listItemActive}" >
            <img src="${image.url}" alt="이미지" class="w-full h-auto aspect-[1/1] object-cover object-center" loading="lazy">
          </li>`
        )
        .join('')}
        </ul>
        ${images.length === 0 ? "<div class='w-full text-center py-40 bg-gray-50 text-gray-500 rounded-xl'>검색 결과 없음</div>" : ''}
        <footer id="footer" class="w-full h-[100px] flex flex-col justify-center items-center">
        ${
          this.isMounted && isLoading
            ? `<span class="loader w-8 h-8"></span>`
            : ''
        }
        </footer>`;
  }

  async mounted(): Promise<void> {
    await this.loadImages({
      breedId: this.state.breedId,
      keyword: this.state.keyword,
    });

    const handleInView = async (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        const { breedId, keyword } = this.state;
        this.loadImages({
          breedId: breedId,
          keyword: keyword,
        });
      }
    };

    this.observer = new IntersectionObserver(handleInView, {
      threshold: 0.5,
    });
    this.observeFooter();
  }

  // IO 감시 시작 메서드
  observeFooter() {
    const footer = document.querySelector('#footer');
    if (footer) this.observer?.observe(footer);
  }

  // 이미지를 불러오는 메서드
  async loadImages(props: { breedId?: string; keyword?: string }) {
    if (this.state.isLoading) return;
    throttle(async () => {
      this.setState({ ...this.state, isLoading: true });
      const data = await getPosts({ ...props });
      if (data) {
        const images = [...this.state.images, ...data];
        const isEnded = data.length === 0 ? true : false;
        const isLoading = false;
        return this.setState({
          ...this.state,
          isLoading,
          isEnded,
          images,
        });
      }
    }, 500);
  }

  // 모달을 렌더링하는 메서드
  async renderModal(id: string) {
    const modalRoot = document.querySelector('#modalRoot');
    const info = await getPost(id);
    if (modalRoot) {
      this.state.modal.push(new Modal(modalRoot, { ...info, id }));
    }
  }

  // 모달 컴포넌트를 제거하는 메서드
  closeModal() {
    this.state.modal[0].unMounted();
    this.state.modal.pop();
  }

  // 리스트 이미지 클릭 이벤트
  handleClickList(e: Event) {
    const target = e.target as Element;
    const closest = target.closest('[data-id]') as HTMLLIElement; // closest()는 루트 방향으로 탐색
    if (!closest) return;
    const id = closest.dataset.id;
    if (id) {
      this.renderModal(id);
    }
  }

  setEvents() {
    document
      .querySelector('.list_wrapper')
      ?.addEventListener('click', this.handleClickList.bind(this));

    if (!this.state.isEnded) this.observeFooter();
  }
}

export default PhotoList;

const styles = {
  listItem:
    'relative rounded-md md:rounded-lg lg:rounded-xl w-full h-auto aspect-[1/1] overflow-hidden hover:shadow-xl cursor-pointer bg-[#ececec]',
  listItemHover:
    'before:hover:block before:hover:absolute before:hover:top-0 before:hover:left-0 before:hover:w-full before:hover:h-full before:hover:bg-white/15',
  listItemActive: 'before:active:shadow-none before:active:bg-black/20',
};
