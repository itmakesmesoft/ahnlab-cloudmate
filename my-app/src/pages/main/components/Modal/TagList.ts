const TagList = ({
  id = '',
  className = '',
  defaultTag,
  tags = [],
  isRemoveable = false,
}: {
  id?: string;
  className?: string;
  defaultTag?: string;
  tags?: unknown[];
  isRemoveable?: boolean;
} = {}) => {
  return `
  <div id="${id}" class="min-h-4 flex flex-row flex-wrap justify-start gap-1 ${className}">
    ${defaultTag ? `<span class="rounded-sm py-[0.1rem] px-2 bg-[#787878] text-white text-sm">${defaultTag}</span>` : ''}
    ${tags
      ?.map(
        (tag) =>
          `<span class="${isRemoveable ? `hover:bg-[#f7f7f7] active:bg-[#e2e2e2] active:text-gray-400` : ''} rounded-sm py-[0.1rem] px-2 bg-[#ececec] text-[#3e3e3e] text-sm flex flex-row items-center justify-between gap-2 cursor-pointer" data-tag="${tag}">#${tag}${isRemoveable ? ` <img src="/icons/close_gray.svg" class="w-3 h-3">` : ''}</span>`
      )
      .join('')}
    </div>
  `;
};

export default TagList;
