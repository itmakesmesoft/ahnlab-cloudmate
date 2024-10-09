import "./index.css";
import {
  submitPost,
  getPost,
  searchCat,
  likePost,
  getPosts,
} from "./modules/firebase.js";
import { breedList } from "./modules/breeds.js";
import { getImageList, getImageDetail } from "./apis/thecatapi.js";
import { debounce, throttle, createElement } from "./modules/common.js";
import { renderModal, openModal, closeModal } from "./modules/modal.js";

let currentPage = 0;
let selectedBreedId = null;

const selectElement = document.querySelector("#filter");
const wrapper = document.querySelector(".list_wrapper");
const footer = document.querySelector("#footer");

const createContent = ({ id, url, title, tags }) => {
  const fragment = document.createDocumentFragment();

  const img = createElement("img", { src: url, alt: "이미지" });
  const h3 = createElement("h3", null, title || "테스트");
  console.log(title);
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
  return fragment;
};

const createInput = ({ type, label, ...props }) => {
  const input = createElement("input", { type, ...props });
  const inputWrapper = createElement("label", {}, label);
  inputWrapper.appendChild(input);
  return inputWrapper;
};

const createTagInput = ({ id, label, tags, ...props }) => {
  const tagList = [...tags] || [];
  const hiddenInput = createElement("input", { type: "hidden", id });
  const addTag = (e) => {
    e.preventDefault();
    const target = document.querySelector(`#__${id}`);
    tagList.push(target.value);
    target.value = "";
    renderTags();
    hiddenInput.value = tagList.join(",");
  };

  const renderTags = () => {
    const fragment = document.createDocumentFragment();
    tagList &&
      tagList?.forEach((tag) => {
        const span = createElement("span");
        span.append(tag);
        fragment.append(span);
      });
    p.replaceChildren(fragment);
  };

  const tagInput = createInput({
    type: "text",
    label: label,
    id: `__${id}`,
  });
  const div = createElement("div");
  const p = createElement("p");
  const button = createElement("button", { onclick: addTag }, "태그추가");
  renderTags();
  div.append(tagInput, button, p, hiddenInput);
  return div;
};

const renderFilterOptions = () => {
  const options = breedList
    .map(({ id, name }) => `<option value="${id}">${name}</option>`)
    .join("");
  selectElement.innerHTML = options;
};

const renderImages = (images) => {
  const fragment = document.createDocumentFragment();
  images.map(({ url, id }) => {
    const img = createElement("img", { src: url, alt: "이미지" });
    const li = createElement("li", { class: "list_item", "data-id": id }, img);
    fragment.append(li);
  });
  wrapper.appendChild(fragment);
};

const clearImages = () => {
  wrapper.replaceChildren();
};

const loadImages = async ({ breedId, page } = {}) => {
  const images = await getPosts({
    breedId,
    page,
  });
  if (images.length) {
    renderImages(images);
  }
};

const handleLoadMore = throttle(() => {
  currentPage += 1;
  loadImages({ breedId: selectedBreedId, page: currentPage });
}, 1000);

const handleClickList = (e) => {
  const tagName = e.target.tagName;
  const className = e.target.getAttribute("class");
  if (tagName !== "LI" || className !== "list_item") return;
  renderContentModal(e.target.dataset.id);
};

const renderContentModal = async (id) => {
  // const data = await getImageDetail(id);
  const info = await getPost(id);
  console.log(info);
  renderModal(createContent({ ...info, id }));
  openModal();
};

const handleFilterChange = debounce(() => {
  selectedBreedId = selectElement.value;
  currentPage = 0;
  clearImages();
  loadImages({ breedId: selectedBreedId });
}, 300);

const handleSearchInputChange = debounce(() => {
  console.log("changed");
  const value = document.querySelector("#search").value;
  getPosts({ breedId: value });
});

const submitInfo = (id) => {
  const title = document.querySelector("#titleInput").value;
  const tagInput = document.querySelector("#tagInput").value;
  const tags = tagInput.split(",");
  console.log(tags);
  submitPost(id, { title, tags });
};

const observer = new IntersectionObserver(handleLoadMore, { threshold: 0.1 });
observer.observe(footer);

selectElement.addEventListener("change", handleFilterChange);
document
  .querySelector(".list_wrapper")
  .addEventListener("click", handleClickList);

document
  .querySelector("#search")
  .addEventListener("change", handleSearchInputChange);

renderFilterOptions();
loadImages();
