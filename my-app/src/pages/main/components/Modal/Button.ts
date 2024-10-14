const Button = ({
  id = '',
  className = '',
  label = '',
}: {
  id?: string;
  className?: string;
  label?: string;
} = {}) => {
  return `
    <button id="${id}" class="rounded-lg bg-gray-200 py-1 hover:bg-gray-100 active:bg-gray-300 ${className}">
      ${label}
    </button>
  `;
};
export default Button;
