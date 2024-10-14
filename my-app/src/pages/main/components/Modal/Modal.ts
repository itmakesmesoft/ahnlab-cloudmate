import Input from "./Input";
import Button from "./Button";
import TagList from "./TagList";
import Component from "../../../../utils/common";
import { breedList } from "../../../../utils/breeds";
import { escapeFromXSS } from "../../../../utils/common";
import {
  ImageDataInterface,
  likePost,
  submitPost,
} from "../../../../utils/firebase";

interface StateInterface {
  originData: ImageDataInterface;
  isEdit: boolean;
  isLoadingLike: boolean;
  formData: ImageDataInterface
}
export default class Modal extends Component<ImageDataInterface, StateInterface> {
  setup(): void {
    this.state = {
      originData: { ...this.props || {} },
      isEdit: false,
      isLoadingLike: false,
      formData: {} as ImageDataInterface,
    }
  }

  template(): string {
    const { isEdit } = this.state;
    const { url } = this.state.originData;
    return `
      <div id="modalOverlay" class="fixed top-0 left-0 bg-[#000]/50 backdrop-blur-md w-screen h-screen"></div>
      <div id="modalContainer" class="relative w-[90%] max-w-[500px] rounded-xl overflow-hidden bg-white drop-shadow-2xl">
        <div class="relative">
          <img src="${url}" alt="고양이 이미지" class="aspect-[1/1] object-cover"></img>
          <button id="hideModal" class="absolute top-4 right-4 rounded-lg p-1 hover:bg-gray-50/10">
            <img src="/icons/close.svg" width="30" height="30" class="drop-shadow-2xl">
          </button>
        </div>
        ${isEdit ? this.renderEditMode(this.state.formData) : this.renderViewMode(this.state.originData)}
      </div>`;
  }
  mounted() {
    this.showModal();
  }
  // 게시글을 보여주는 모드
  renderViewMode({ breedId, title, tags }: ImageDataInterface): string {
    return `
      <div class="px-6 pt-4 pb-6 flex flex-col">
        <div class="flex flex-row justify-between mb-1">
          ${this.renderLikeButton(this.state.originData)}
          <button id="editPost" class="rounded-lg p-1 hover:bg-gray-200">
            <img src="/icons/edit.svg" width="24" height="24">
          </button>
        </div>
        <p class="mb-4">${title || "<span class='text-gray-400'>제목 없음</span>"}</p>
        ${TagList({ defaultTag: breedList.find((item) => item.id === breedId)?.name, tags: tags })}
      </div>`;
  }
  // 게시글을 수정하는 모드
  renderEditMode({ tags, title }: ImageDataInterface): string {
    return `
      <div class="px-6 pt-4 pb-6 flex flex-col justify-between">
        ${Input({ id: "titleInput", value: title, placeholder: "제목을 입력해주세요.", label: "제목", className: "mb-4" })}
        ${Input({ id: "tagInput", placeholder: "태그를 추가해주세요.", label: "태그", buttonId: "addTagButton", buttonLabel: "추가", className: "mb-2" })}
        ${TagList({ id: "tagContainer", tags: tags, isRemoveable: true, className: "mb-6" })}
        <div class="grid grid-cols-2 gap-1">
          ${Button({ id: "cancelEditButton", label: "취소" })}
          ${Button({ id: "submitButton", label: "저장" })}
        </div>
      </div>`;
  }
  // 게시글 좋아요 버튼 렌더링
  renderLikeButton({ isLiked, likesCount }: ImageDataInterface) {
    return LikeButton({
      id: "likeButton",
      isLiked,
      count: likesCount,
      isLoading: this.state.isLoadingLike,
    });
  }
  // 모달 열기
  showModal() {
    document.querySelector("#modalRoot")?.classList.add("active");
  }
  // 모달 닫기
  hideModal() {
    document.querySelector("#modalRoot")?.classList.remove("active");
  }
  // 게시글 정보 수정 제출
  submitImageInfo() {
    const titleInput = document.querySelector(
      "#titleInput"
    ) as HTMLInputElement;
    const title = escapeFromXSS(titleInput.value);
    const formData = this.state.formData;
    submitPost({ ...formData, title });
    this.setState({
      originData: { ...formData, title },
      isEdit: false,
    });
  }
  // 태그 추가
  addTag() {
    const input = document.querySelector("#tagInput") as HTMLInputElement;
    const title = document.querySelector("#titleInput") as HTMLInputElement;
    const newTag = escapeFromXSS(input.value.trim());
    if (!newTag) return;
    const formData = this.state.formData;
    this.setState({
      formData: {
        ...formData,
        title: title.value,
        tags: [...formData.tags, newTag],
      },
    });
    input.value = "";
  }
  // 태그 삭제
  removeTag = (e: Event) => {
    const target = e.target as HTMLSpanElement;
    const title = document.querySelector("#titleInput") as HTMLInputElement;
    const tagToRemove = target.closest("[data-tag]") as HTMLSpanElement;
    if (!tagToRemove) return;
    const formData = this.state.formData;
    const index = formData.tags.indexOf(escapeFromXSS(tagToRemove.dataset.tag));
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    this.setState({
      formData: { ...formData, title: title.value, tags: newTags },
    });
  };
  // 게시글 좋아요
  toggleLike() {
    const { isLoadingLike, originData } = this.state;
    const { id, isLiked, likesCount } = this.state.originData;
    if (isLoadingLike) return;
    this.setState({ isLoadingLike: true });
    likePost(id).then((result) => {
      if (result) {
        this.setState({
          originData: {
            ...originData,
            isLiked: !isLiked,
            likesCount: isLiked ? likesCount - 1 : likesCount + 1,
          },
          isLoadingLike: false,
        });
      }
    });
  }
  // 게시글 수정 클릭
  handleEditPost() {
    this.setState({ formData: { ...this.state.originData }, isEdit: true });
  }
  // 게시글 수정 취소 클릭
  handleCancelEdit() {
    this.setState({ isEdit: false });
  }
  // 게시글 수정 시 태그 입력 이벤트
  handleTagInput(e: Event) {
    const event = e as KeyboardEvent;
    if (event.key === "Enter") this.addTag();
  }
  setEvents(): void {
    document
      .querySelector("#addTagButton")
      ?.addEventListener("click", this.addTag.bind(this));
    document
      .querySelector("#editPost")
      ?.addEventListener("click", this.handleEditPost.bind(this));
    document
      .querySelector("#cancelEditButton")
      ?.addEventListener("click", this.handleCancelEdit.bind(this));
    document
      .querySelector("#submitButton")
      ?.addEventListener("click", this.submitImageInfo.bind(this));
    document
      .querySelector("#likeButton")
      ?.addEventListener("click", this.toggleLike.bind(this));
    document
      .querySelector("#tagInput")
      ?.addEventListener("keydown", this.handleTagInput.bind(this));
    document
      .querySelector("#tagContainer")
      ?.addEventListener("click", this.removeTag.bind(this));
    document
      .querySelector("#hideModal")
      ?.addEventListener("click", this.hideModal.bind(this));
    document
      .querySelector("#modalOverlay")
      ?.addEventListener("click", this.hideModal.bind(this));
  }
}

// 좋아요 버튼
const LikeButton = ({
  id = "",
  isLiked = false,
  isLoading = false,
  count,
}: {
  id?: string;
  isLiked?: boolean;
  isLoading?: boolean;
  count?: number;
} = {}) => {
  return `
    <button id="${id}" class="flex flex-row gap-2 items-center group p-1">
      <svg class="h-6 w-6 ${isLiked ? "text-red-500" : "text-gray-300"} fill-current group-hover:text-red-700" xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 16 16">
        <path style="fill: inherit" d="M1.243 8.243 8 15l6.757-6.757a4.243 4.243 0 0 0 1.243-3v-.19A4.052 4.052 0 0 0 8.783 2.52L8 3.5l-.783-.98A4.052 4.052 0 0 0 0 5.053v.19c0 1.126.447 2.205 1.243 3Z"/>
      </svg>
      ${isLoading ? "<span class='loader w-4 h-4'></span>" : count === undefined ? "" : count}
    </button>`;
};
