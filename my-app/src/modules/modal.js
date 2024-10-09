const modalRoot = document.querySelector("#modalRoot");
const modalContainer = document.querySelector("#modalContainer");

const openModal = (content) => {
  console.log("open", content);
  modalRoot.classList.add("active");
};

const closeModal = () => {
  modalRoot.classList.remove("active");
  clearModal();
};

const clearModal = () => {
  modalContainer.replaceChildren();
};

const renderModal = (element) => {
  clearModal();
  modalContainer.appendChild(element);
};

document.querySelector("#modalOverlay").addEventListener("click", closeModal);

export { renderModal, openModal, closeModal };
