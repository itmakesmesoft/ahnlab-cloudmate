interface InputProps {
  type?: string;
  id?: string;
  className?: string;
  value?: string | number;
  placeholder?: string;
  label?: string;
  buttonId?: string;
  buttonLabel?: string;
}

const Input = ({
  type = "text",
  id = "",
  className = "",
  value = "",
  placeholder = "",
  label = "",
  buttonId = "",
  buttonLabel = "",
}: InputProps = {}) => {
  return `
    <div class="flex flex-col justify-between">
      <label class="text-xs mb-1 ml-2" for="${id}">${label}</label>
      <div class="relative">
        <input type="${type}" value="${value}" id="${id}" placeholder="${placeholder}" class="border rounded-md bg-white w-full py-1 px-2 ${className}">
        ${buttonId || buttonLabel ? `<button id="${buttonId}" class="absolute top-1 right-1 bg-gray-100 px-2 rounded-sm">${buttonLabel}</button>` : ""}
      </div>
    </div>
  `;
};

export default Input;
