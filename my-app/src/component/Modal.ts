import Component from "../utils/common";
import { breedList } from "../utils/breeds";
import { escapeFromXSS } from "../utils/common";
import { ImageDataInterface, likePost, submitPost } from "../utils/firebase";

export default class Modal extends Component {
  setup(): void {
    this.state = {
      originData: { ...this.props } as ImageDataInterface,
      isEdit: false,
      isLoadingLike: false,
      formData: {} as ImageDataInterface,
    };
    console.log("this.props!!!!!!!!!", this.props);
  }

  template(): string {
    const { isEdit } = this.state;
    const origin = this.state.originData;
    const form = this.state.formData;
    return `
      <div id="modalOverlay" class="fixed top-0 left-0 bg-[#000]/50 backdrop-blur-md w-screen h-screen"></div>
      <div id="modalContainer" class="relative w-[90%] max-w-[500px] rounded-xl overflow-hidden bg-white drop-shadow-2xl">
        <div class="relative">
          <img src="${origin.url}" alt="고양이 이미지" class="aspect-[1/1] object-cover"></img>
          <button id="closeModal" class="absolute top-4 right-4 rounded-lg p-1 hover:bg-gray-50/10">
            <img src="/icons/close.svg" width="30" height="30" class="drop-shadow-2xl">
          </button>
        </div>
        ${isEdit ? this.renderEditMode(form.tags, form.title) : this.renderViewMode(origin.isLiked, origin.likesCount, origin.breedId, origin.title, origin.tags)}
      </div>`;
  }
  renderViewMode(
    isLiked: boolean,
    likesCount: number,
    breedId: string,
    title: string,
    tags: string[]
  ): string {
    return `
      <div class="px-6 pt-4 pb-6 flex flex-col">
        <div class="flex flex-row justify-between mb-1">
          <button id="likeBtn" class="flex flex-row gap-2 items-center group p-1">

            <svg class="h-6 w-6 ${isLiked ? "text-red-500" : "text-gray-300"} fill-current group-hover:text-red-700" xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 16 16">
              <path style="fill: inherit" d="M1.243 8.243 8 15l6.757-6.757a4.243 4.243 0 0 0 1.243-3v-.19A4.052 4.052 0 0 0 8.783 2.52L8 3.5l-.783-.98A4.052 4.052 0 0 0 0 5.053v.19c0 1.126.447 2.205 1.243 3Z"/>
            </svg>
            ${this.state.isLoadingLike ? "<span class='loader w-4 h-4'></span>" : likesCount}
          </button>
          <button id="editPost" class="rounded-lg p-1 hover:bg-gray-200">
            <img src="/icons/edit.svg" width="24" height="24">
          </button>
        </div>
        <p class="mb-4">${title || "<span class='text-gray-400'>제목 없음</span>"}</p>
        <div class="min-h-4 flex flex-row flex-wrap justify-start gap-1">
        <span class="rounded-sm py-[0.1rem] px-2 bg-[#787878] text-white text-sm">${breedList.find((item) => item.id === breedId)?.name}</span>
        ${tags
          .map(
            (tag) =>
              `<span class="rounded-sm py-[0.1rem] px-2 bg-[#ececec] text-[#3e3e3e] text-sm flex flex-row items-center justify-between gap-2 cursor-pointer" data-tag="${tag}">#${tag}</span>`
          )
          .join("")}
        </div>
      </div>`;
  }
  renderEditMode(tags: string[], title: string): string {
    return `
      <div class="px-6 pt-4 pb-6 flex flex-col justify-between">
        <label class="text-xs mb-1 ml-2" for="titleInput">제목</label>
        <input type="text" id="titleInput" value="${title}" class="border rounded-md bg-white w-full py-1 px-2 mb-4" placeholder="제목을 입력해주세요">
        <div class="w-full">
          <label class="text-xs mb-1 ml-2" for="tagInput">태그</label>
          <div class="relative">
            <input type="text" id="tagInput" class="border rounded-md bg-white w-full py-1 px-2 mb-2" placeholder="태그를 추가해주세요">
            <button id="addTagBtn" class="absolute top-1 right-1 bg-gray-100 px-2 rounded-sm">추가</button>
          </div>
          <div id="tagContainer" class="min-h-4 flex flex-row flex-wrap justify-start gap-1 mb-6">
          ${tags
            .map(
              (tag) =>
                `<span class="rounded-sm py-[0.1rem] px-2 bg-[#ececec] text-[#3e3e3e] text-sm flex flex-row items-center justify-between gap-2 cursor-pointer hover:bg-[#f7f7f7] active:bg-[#e2e2e2] active:text-gray-400" data-tag="${tag}">#${tag} <img src="/icons/close_gray.svg" class="w-3 h-3"></span>`
            )
            .join("")}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-1">
          <button id="cancelEditBtn" class="rounded-lg bg-gray-200 py-1 hover:bg-gray-100 active:bg-gray-300">취소</button>
          <button id="submitBtn" class="rounded-lg bg-gray-200 py-1 hover:bg-gray-100 active:bg-gray-300">저장</button>
        </div>
      </div>`;
  }
  mounted() {
    this.openModal();
  }
  openModal() {
    document.querySelector("#modalRoot")?.classList.add("active");
  }
  closeModal() {
    document.querySelector("#modalRoot")?.classList.remove("active");
  }
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
  handleTagInput(e: Event) {
    const event = e as KeyboardEvent;
    if (event.key === "Enter") this.addTag();
  }
  setEvents(): void {
    document
      .querySelector("#addTagBtn")
      ?.addEventListener("click", this.addTag.bind(this));
    document
      .querySelector("#editPost")
      ?.addEventListener("click", () =>
        this.setState({ formData: { ...this.state.originData }, isEdit: true })
      );
    document
      .querySelector("#cancelEditBtn")
      ?.addEventListener("click", () => this.setState({ isEdit: false }));
    document
      .querySelector("#submitBtn")
      ?.addEventListener("click", this.submitImageInfo.bind(this));
    document
      .querySelector("#likeBtn")
      ?.addEventListener("click", this.toggleLike.bind(this));
    document
      .querySelector("#tagInput")
      ?.addEventListener("keydown", this.handleTagInput.bind(this));
    document
      .querySelector("#tagContainer")
      ?.addEventListener("click", this.removeTag.bind(this));
    document
      .querySelector("#closeModal")
      ?.addEventListener("click", this.closeModal.bind(this));
    document
      .querySelector("#modalOverlay")
      ?.addEventListener("click", this.closeModal.bind(this));
  }
}
